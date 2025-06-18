import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import type { CVData } from "@shared/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CVFormProvider,
  PersonalSection,
  ContactSection,
  EducationSection,
  CertificatesSection,
  SkillsSection,
  HobbiesSection,
  ExperienceSection,
  ProjectsSection,
  SummarySection,
  ActionButtons,
} from "@/components/cv-form";

interface InfoFormProps {
  extractedData: CVData;
  onUploadAnother: () => void;
}

type DisplayMode = "brief" | "contact" | "full";

export default function InfoForm({
  extractedData,
  onUploadAnother,
}: InfoFormProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("brief");

  return (
    <CVFormProvider initialData={extractedData}>
      <div>
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Extracted Information
              </h2>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Successfully extracted</span>
              </div>
            </div>

            {/* Tab Controls */}
            <div className="flex space-x-3 mb-6">
              <Button
                variant={displayMode === "brief" ? "default" : "outline"}
                onClick={() => setDisplayMode("brief")}
                className="transition-all"
              >
                Brief Info
              </Button>
              <Button
                variant={displayMode === "contact" ? "default" : "outline"}
                onClick={() => setDisplayMode("contact")}
                className="transition-all"
              >
                Contact Info
              </Button>
              <Button
                variant={displayMode === "full" ? "default" : "outline"}
                onClick={() => setDisplayMode("full")}
                className="transition-all"
              >
                Full Details
              </Button>
            </div>

            <div className="space-y-8">
              {/* Brief Info sections - always shown */}
              <PersonalSection />

              {/* Contact Info section - shown in contact and full modes */}
              {(displayMode === "contact" || displayMode === "full") && (
                <ContactSection />
              )}

              {/* Full details sections - only shown in full mode */}
              {displayMode === "full" && (
                <>
                  <EducationSection />
                  <CertificatesSection />
                  <SkillsSection />
                  <HobbiesSection />
                  <ExperienceSection />
                  <ProjectsSection />
                  <SummarySection />
                </>
              )}

              <Separator />
              <ActionButtons onUploadAnother={onUploadAnother} />
            </div>
          </CardContent>
        </Card>
      </div>
    </CVFormProvider>
  );
}
