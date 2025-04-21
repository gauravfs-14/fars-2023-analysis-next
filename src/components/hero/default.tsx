import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import BackgroundPattern from "./background-pattern";

const Hero = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      id="hero"
    >
      <BackgroundPattern />

      <div className="relative z-10 text-center max-w-2xl">
        <Badge className="bg-gradient-to-br via-70% from-primary via-primary/60 to-primary rounded-full py-1 border-none">
          FARS Data 2016-2023
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
          FARS Crash Data Analysis
        </h1>
        <p className="mt-6 text-[17px] md:text-lg">
          Explore and analyze crash data from the Fatality Analysis Reporting
          System (FARS) from 2016 to 2023 through interactive visualizations.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="!h-5 !w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="!h-5 !w-5" /> Watch Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
