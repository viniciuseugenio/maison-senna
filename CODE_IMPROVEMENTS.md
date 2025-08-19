# Recommended Code Improvements

## High Priority Fixes

### 1. Fix Cookie Security for Production

**File**: `backend/apps/accounts/utils.py`
**Line**: 44-45

**Current Code**:
```python
response.set_cookie(
    key="access_token",
    value=access_token,
    max_age=access_max_age,
    secure=False,  # TODO: Set to True in production
    httponly=True,
)
```

**Recommended Fix**:
```python
from django.conf import settings

response.set_cookie(
    key="access_token",
    value=access_token,
    max_age=access_max_age,
    secure=not settings.DEBUG,  # True in production, False in development
    httponly=True,
    samesite='Lax',  # Additional CSRF protection
)
```

### 2. Remove Unreachable Code

**File**: `backend/apps/accounts/api/views.py`
**Line**: 67-68

**Current Code**:
```python
except User.DoesNotExist:
    return Response(
        {"detail": "User not found for the provided token"},
        status=status.HTTP_401_UNAUTHORIZED,
    )
    raise NotAuthenticated()  # This line is unreachable
```

**Recommended Fix**:
```python
except User.DoesNotExist:
    return Response(
        {"detail": "User not found for the provided token"},
        status=status.HTTP_401_UNAUTHORIZED,
    )
```

### 3. Improve Exception Handling in Google OAuth

**File**: `backend/apps/accounts/api/views.py`
**Line**: 107-108

**Current Code**:
```python
except Exception as e:
    return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

**Recommended Fix**:
```python
except (ValueError, KeyError) as e:
    logger.warning(f"OAuth token exchange failed: {str(e)}")
    return Response(
        {"detail": "Invalid authorization code"}, 
        status=status.HTTP_400_BAD_REQUEST
    )
except requests.RequestException:
    logger.error("Failed to communicate with Google OAuth server")
    return Response(
        {"detail": "Authentication service temporarily unavailable"}, 
        status=status.HTTP_503_SERVICE_UNAVAILABLE
    )
except Exception as e:
    logger.error(f"Unexpected OAuth error: {str(e)}")
    return Response(
        {"detail": "Authentication failed"}, 
        status=status.HTTP_400_BAD_REQUEST
    )
```

## Medium Priority Improvements

### 4. Implement Token Blacklisting (Optional but Recommended)

**Create new file**: `backend/apps/accounts/models.py` (add to existing)

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class BlacklistedToken(models.Model):
    token = models.CharField(max_length=500, unique=True)
    blacklisted_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'blacklisted_tokens'
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['blacklisted_at']),
        ]
```

**Update**: `backend/apps/accounts/api/middlewares.py`

```python
from apps.accounts.models import BlacklistedToken

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if access_token:
            # Check if token is blacklisted
            if BlacklistedToken.objects.filter(token=access_token).exists():
                return None
                
            try:
                decoded = jwt.decode(
                    access_token.encode(), env("SECRET_KEY"), algorithms=["HS256"]
                )
                user_id = decoded["user_id"]
                user = User.objects.get(id=user_id)
                return (user, None)

            except (jwt.exceptions.InvalidTokenError, User.DoesNotExist):
                return None

        return None
```

**Update**: `backend/apps/accounts/api/views.py` (LogoutView)

```python
from apps.accounts.models import BlacklistedToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Blacklist the current access token
        access_token = request.COOKIES.get("access_token")
        if access_token:
            BlacklistedToken.objects.create(
                token=access_token,
                user=request.user
            )
        
        response = Response(get_success_message("LOGOUT"), status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
```

### 5. Fix Frontend Schema Validation Logic

**File**: `frontend/src/schemas/auth.ts`
**Line**: 28-32

**Current Code** (confusing logic):
```typescript
.refine(
  (data) =>
    (data.firstName === "" && data.lastName === "") ||
    data.firstName.toLowerCase() !== data.lastName.toLowerCase(),
  {
    path: ["lastName"],
    message: REGISTER_FORM_ERRORS.FIRST_LAST_NAME_EQUAL,
  },
)
```

**Recommended Fix** (assuming first and last names shouldn't be the same):
```typescript
.refine(
  (data) => {
    // Only check if both fields have values
    if (data.firstName && data.lastName) {
      return data.firstName.toLowerCase() !== data.lastName.toLowerCase();
    }
    return true; // Skip validation if either field is empty
  },
  {
    path: ["lastName"],
    message: REGISTER_FORM_ERRORS.FIRST_LAST_NAME_EQUAL,
  },
)
```

### 6. Add Rate Limiting (Django)

**Install**: `django-ratelimit`
```bash
pip install django-ratelimit
```

**Update**: `backend/apps/accounts/api/views.py`
```python
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

@method_decorator(ratelimit(key='ip', rate='5/m', method='POST'), name='post')
class CustomTokenObtainPairView(APIView):
    # existing code...

@method_decorator(ratelimit(key='ip', rate='3/m', method='POST'), name='post')
class PasswordRequestResetView(APIView):
    # existing code...
```

## Low Priority Enhancements

### 7. Add Logging for Authentication Events

**Create**: `backend/apps/accounts/utils.py` (add to existing)

```python
import logging

auth_logger = logging.getLogger('auth')

def log_auth_event(event_type, user=None, ip_address=None, extra_data=None):
    """Log authentication events for security monitoring"""
    message = f"Auth event: {event_type}"
    extra = {
        'event_type': event_type,
        'user_id': user.id if user else None,
        'user_email': user.email if user else None,
        'ip_address': ip_address,
        'extra_data': extra_data or {}
    }
    auth_logger.info(message, extra=extra)
```

**Usage in views**:
```python
# In login view
def post(self, request):
    # ... existing code ...
    if user:
        log_auth_event('LOGIN_SUCCESS', user=user, ip_address=request.META.get('REMOTE_ADDR'))
    else:
        log_auth_event('LOGIN_FAILED', ip_address=request.META.get('REMOTE_ADDR'))
```

### 8. Add Environment-Specific Configuration

**Update**: `backend/CORE/settings/environment.py`

```python
# JWT Configuration
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=env.int("ACCESS_TOKEN_LIFETIME_MINUTES", default=15)
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=env.int("REFRESH_TOKEN_LIFETIME_DAYS", default=14)
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# Cookie Security
COOKIE_SECURE = not DEBUG
COOKIE_SAMESITE = 'Lax'
COOKIE_HTTPONLY = True
```

### 9. Frontend Error Boundary for Auth

**Create**: `frontend/src/components/AuthErrorBoundary.tsx`

```typescript
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth error:', error, errorInfo);
    // You could send this to a logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-error">
          <h2>Authentication Error</h2>
          <p>Please refresh the page or try logging in again.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
```

## Migration Instructions

### For Token Blacklisting:
1. Add the BlacklistedToken model
2. Run migrations: `python manage.py makemigrations && python manage.py migrate`
3. Update middleware and logout view
4. Consider adding a cleanup task for expired tokens

### For Rate Limiting:
1. Install django-ratelimit
2. Add decorators to views
3. Configure rate limits based on your needs
4. Monitor logs for blocked requests

### Testing:
- Run all existing tests to ensure no breaking changes
- Add tests for new functionality
- Test rate limiting in development environment
- Verify cookie security in staging environment