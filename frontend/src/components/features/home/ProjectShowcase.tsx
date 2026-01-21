import sennaImg from "@assets/senna-music.jpg";
import ProjectTool from "./ProjectTool";
import VerticalDivider from "@components/ui/VerticalDivider";
import Button from "@components/ui/Button";
import { Github, Linkedin } from "lucide-react";
import HorizontalDivider from "@components/ui/HorizontalDivider";

export default function ProjectShowcase() {
  return (
    <section className="bg-oyster/15 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-md">
            <img src={sennaImg} className="h-full w-full object-cover" />
          </div>

          <div>
            <h2 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
              Portfolio Project
            </h2>

            <HorizontalDivider />

            <p className="text-mine-shaft/90 mt-6 leading-relaxed">
              Maison Senna is a concept luxury e-commerce project designed to
              showcase modern web development and front-end skills. This
              fictional brand embodies the elegance and sophistication of
              high-end retail experiences.
            </p>

            <p className="text-mine-shaft/90 mt-6 leading-relaxed">
              The project demonstrates expertise with front-end, such as React
              and TailwindCSS, along with a robust back-end powered by Django
              REST, and attention to detail that elevates the digital shopping
              experience. Every element has been carefully crafted to display
              and exercise the skills acquired during studies.
            </p>

            <div className="mt-10 flex items-center space-x-6">
              <ProjectTool tool="React" area="Frontend" />
              <VerticalDivider />
              <ProjectTool tool="Django REST" area="Framework" />
              <VerticalDivider />
              <ProjectTool tool="Tailwind" area="Styling" />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                onClick={() =>
                  window.open(
                    "https://github.com/viniciuseugenio/maison-senna",
                    "_blank",
                  )
                }
              >
                <Github className="mr-2 h-4 w-4" />
                VIEW SOURCE
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/eugencius/",
                    "_blank",
                  )
                }
              >
                <Linkedin className="mr-2 h-4 w-4" /> CONNECT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
