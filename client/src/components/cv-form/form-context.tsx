import { createContext, useState, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CVData } from "@shared/schema";

interface CVFormContextProps {
  formData: CVData;
  handleInputChange: (field: keyof CVData, value: string) => void;
  handleArrayInputChange: (field: keyof CVData, value: string) => void;
  handleEducationChange: (index: number, field: string, value: string) => void;
  handleExpertiseChange: (index: number, field: string, value: string) => void;
  handleProjectChange: (
    index: number,
    field: string,
    value: string | string[]
  ) => void;
  handleProjectPhasesChange: (index: number, value: string) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  addExperience: () => void;  removeExperience: (index: number) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
  handleSave: () => void;
  handleExportPDF: () => Promise<void>;
  handleReset: () => void;
}

interface CVFormProviderProps {
  children: ReactNode;
  initialData: CVData;
}

const CVFormContext = createContext<CVFormContextProps | undefined>(undefined);

export function CVFormProvider({ children, initialData }: CVFormProviderProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CVData>({
    ...initialData,
    language: Array.isArray(initialData.language) ? initialData.language : [],
    phone: Array.isArray(initialData.phone) ? initialData.phone : [],
    education: Array.isArray(initialData.education)
      ? initialData.education
      : [],
    skills: Array.isArray(initialData.skills) ? initialData.skills : [],
    expertise: Array.isArray(initialData.expertise)
      ? initialData.expertise
      : [],
    certificates: Array.isArray(initialData.certificates)
      ? initialData.certificates
      : [],
    hobbies: Array.isArray(initialData.hobbies) ? initialData.hobbies : [],
    projects: Array.isArray(initialData.projects) ? initialData.projects : [],
    location: initialData.location || "",
    linkedin: initialData.linkedin || "",
  });

  // Input change handlers
  const handleInputChange = (field: keyof CVData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field: keyof CVData, value: string) => {
    const itemsArray = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setFormData((prev) => ({
      ...prev,
      [field]: itemsArray,
    }));
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleExpertiseChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleProjectChange = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const handleProjectPhasesChange = (index: number, value: string) => {
    const phasesArray = value
      .split(",")
      .map((phase) => phase.trim())
      .filter((phase) => phase.length > 0);
    handleProjectChange(index, "phases", phasesArray);
  };

  // Add/Remove item handlers
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          location: "",
          start_date: "",
          end_date: "",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      expertise: [
        ...prev.expertise,
        { date: "", company: "", role: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          project_name: "",
          industry: "",
          country: "",
          role: "",
          phases: [],
        },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Action handlers
  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your CV information has been updated successfully.",
    });
  };

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your CV...",
      });

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();      if (result.success && result.pdfUrl) {
        // Create a download link with proper filename
        const firstName = formData.first_name || 'Unknown';
        const lastName = formData.last_name || 'User';
        const filename = `cv-${firstName}_${lastName}.pdf`;
        
        const link = document.createElement('a');
        link.href = result.pdfUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "PDF Generated",
          description: "Your CV has been generated successfully!",
        });
      } else {
        throw new Error(result.error || 'Failed to generate PDF');
      }
    } catch (error: any) {
      console.error('PDF export error:', error);
      
      toast({
        title: "Export Failed",
        description: error.message || "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialData,
      language: Array.isArray(initialData.language)
        ? [...initialData.language]
        : [],
      phone: Array.isArray(initialData.phone) ? [...initialData.phone] : [],
      education: Array.isArray(initialData.education)
        ? [...initialData.education]
        : [],
      skills: Array.isArray(initialData.skills) ? [...initialData.skills] : [],
      expertise: Array.isArray(initialData.expertise)
        ? [...initialData.expertise]
        : [],
      certificates: Array.isArray(initialData.certificates)
        ? [...initialData.certificates]
        : [],
      hobbies: Array.isArray(initialData.hobbies)
        ? [...initialData.hobbies]
        : [],
      projects: Array.isArray(initialData.projects)
        ? [...initialData.projects]
        : [],
    });

    toast({
      title: "Form reset",
      description: "All changes have been reverted to original extracted data.",
    });
  };

  return (
    <CVFormContext.Provider
      value={{
        formData,
        handleInputChange,
        handleArrayInputChange,
        handleEducationChange,
        handleExpertiseChange,
        handleProjectChange,
        handleProjectPhasesChange,
        addEducation,
        removeEducation,
        addExperience,
        removeExperience,
        addProject,
        removeProject,        handleSave,
        handleExportPDF,
        handleReset,
      }}
    >
      {children}
    </CVFormContext.Provider>
  );
}

export const useCVForm = () => {
  const context = useContext(CVFormContext);
  if (context === undefined) {
    throw new Error("useCVForm must be used within a CVFormProvider");
  }
  return context;
};
