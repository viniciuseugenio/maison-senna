import { UserDropdownItem } from "./UserDropdown";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <UserDropdownItem>
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </UserDropdownItem>
  );
}
