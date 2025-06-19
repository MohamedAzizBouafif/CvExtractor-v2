import { createContext, useState, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CVData } from "@shared/schema";

interface CVFormContextProps {
  formData: CVData;
  updateField: (field: keyof CVData, value: any) => void;
  updateArrayField: (field: keyof CVData, value: string) => void;
  updateNestedField: (
    field: keyof CVData,
    index: number,
    subField: string,
    value: string | string[]
  ) => void;
  addItem: (field: keyof CVData, template: any) => void;
  removeItem: (field: keyof CVData, index: number) => void;
  handleSave: () => void;
  handleExportPDF: () => Promise<void>;
  handleReset: () => void;
}

interface CVFormProviderProps {
  children: ReactNode;
  initialData: CVData;
}

const CVFormContext = createContext<CVFormContextProps | undefined>(undefined);

// Helper function to ensure arrays are properly initialized
const initializeArrays = (data: CVData): CVData => ({
  ...data,
  language: Array.isArray(data.language) ? data.language : [],
  phone: Array.isArray(data.phone) ? data.phone : [],
  education: Array.isArray(data.education) ? data.education : [],
  skills: Array.isArray(data.skills) ? data.skills : [],
  expertise: Array.isArray(data.expertise) ? data.expertise : [],
  certificates: Array.isArray(data.certificates) ? data.certificates : [],
  hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
  projects: Array.isArray(data.projects) ? data.projects : [],
  location: data.location || "",
  linkedin: data.linkedin || "",
});

// Templates for new items
const ITEM_TEMPLATES = {
  education: { degree: "", institution: "", location: "", start_date: "", end_date: "" },
  expertise: { date: "", company: "", role: "", description: "" },
  projects: { project_name: "", industry: "", country: "", role: "", phases: [] },
} as const;

export function CVFormProvider({ children, initialData }: CVFormProviderProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CVData>(initializeArrays(initialData));

  // Generic field updater
  const updateField = (field: keyof CVData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Array field updater (comma-separated strings to arrays)
  const updateArrayField = (field: keyof CVData, value: string) => {
    const itemsArray = value
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);
    updateField(field, itemsArray);
  };

  // Nested field updater (for objects within arrays)
  const updateNestedField = (
    field: keyof CVData,
    index: number,
    subField: string,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };

  // Generic item adder
  const addItem = (field: keyof CVData, template: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), template],
    }));
  };

  // Generic item remover
  const removeItem = (field: keyof CVData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }));
  };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success && result.pdfUrl) {
        const fileName = `cv-${formData.first_name || 'Unknown'}_${formData.last_name || 'User'}.pdf`;
        
        const link = document.createElement('a');
        link.href = result.pdfUrl;
        link.download = fileName;
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
    setFormData(initializeArrays({ ...initialData }));
    toast({
      title: "Form reset",
      description: "All changes have been reverted to original extracted data.",
    });
  };

  return (
    <CVFormContext.Provider
      value={{
        formData,
        updateField,
        updateArrayField,
        updateNestedField,
        addItem,
        removeItem,
        handleSave,
        handleExportPDF,
        handleReset,
      }}
    >
      {children}
    </CVFormContext.Provider>
  );
}

// Convenience hooks for specific operations
export const useCVForm = () => {
  const context = useContext(CVFormContext);
  if (!context) {
    throw new Error("useCVForm must be used within a CVFormProvider");
  }
  return context;
};

export const useCVFormActions = () => {
  const { addItem, removeItem } = useCVForm();
  
  return {
    addEducation: () => addItem('education', ITEM_TEMPLATES.education),
    removeEducation: (index: number) => removeItem('education', index),
    addExperience: () => addItem('expertise', ITEM_TEMPLATES.expertise),
    removeExperience: (index: number) => removeItem('expertise', index),
    addProject: () => addItem('projects', ITEM_TEMPLATES.projects),
    removeProject: (index: number) => removeItem('projects', index),
  };
};
