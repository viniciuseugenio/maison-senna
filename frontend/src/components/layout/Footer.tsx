import { Link } from "react-router";
import { Instagram, Twitter, Facebook } from "lucide-react";
import FooterSocialLink from "./FooterSocialLink";
import FooterLi from "./FooterLi";

export default function Footer() {
  return (
    <footer className="bg-mine-shaft text-light">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="m:grid-cols-2 grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-lg font-light tracking-wider">
              MAISON SENNA
            </h3>
            <p className="text-light/80 mt-4 text-sm">
              Crafting timeless luxury pieces that celebrate the art of fine
              craftsmanship and enduring elegance.
            </p>
            <div className="mt-6 flex space-x-4">
              <FooterSocialLink href="hhtps://www.instagram.com">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </FooterSocialLink>
              <FooterSocialLink href="https://www.facebook.com">
                <Facebook className="h-5 w-5" />{" "}
                <span className="sr-only">Facebook</span>
              </FooterSocialLink>
              <FooterSocialLink href="https://www.x.com">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter/X</span>
              </FooterSocialLink>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              <FooterLi label="Collections" />
              <FooterLi label="Jewelry" />
              <FooterLi label="Accessories" />
              <FooterLi label="Gift Cards" />
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase">
              About
            </h3>
            <ul className="mt-4 space-y-2">
              <FooterLi label="Our Story" />
              <FooterLi label="Craftsmanship" />
              <FooterLi label="Sustainability" />
              <FooterLi label="Press" />
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase">
              Customer Care
            </h3>
            <ul className="mt-4 space-y-2">
              <FooterLi label="Contact Us" />
              <FooterLi label="Shipping & Returns" />
              <FooterLi label="Product Care" />
              <FooterLi label="Press" />
            </ul>
          </div>
        </div>

        <div className="border-light/10 mt-16 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-light/50 text-xs">
              &copy; {new Date().getFullYear()} Maison Senna. All Rights
              Reserved.
            </p>
            <div className="flex space-x-6">
              <Link className="text-light/50 hover:text-light text-xs transition-colors">
                Terms of Service
              </Link>
              <Link className="text-light/50 hover:text-light text-xs transition-colors">
                Privacy Policy
              </Link>
              <Link className="text-light/50 hover:text-light text-xs transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
