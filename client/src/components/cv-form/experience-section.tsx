import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useCVForm } from "./form-context";

export function ExperienceSection() {
  const { formData, handleExpertiseChange, addExperience, removeExperience } =
    useCVForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Professional Experience
      </h3>

      <div className="space-y-4">
        {formData.expertise.map((exp, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor={`date-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Date Range
                </Label>
                <Input
                  id={`date-${index}`}
                  value={exp.date}
                  onChange={(e) =>
                    handleExpertiseChange(index, "date", e.target.value)
                  }
                  className="mt-2"
                  placeholder="e.g., 2020 - 2022"
                />
              </div>
              <div>
                <Label
                  htmlFor={`company-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Company
                </Label>
                <Input
                  id={`company-${index}`}
                  value={exp.company}
                  onChange={(e) =>
                    handleExpertiseChange(index, "company", e.target.value)
                  }
                  className="mt-2"
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label
                  htmlFor={`role-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Role
                </Label>
                <Input
                  id={`role-${index}`}
                  value={exp.role}
                  onChange={(e) =>
                    handleExpertiseChange(index, "role", e.target.value)
                  }
                  className="mt-2"
                  placeholder="Job title"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label
                htmlFor={`description-${index}`}
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id={`description-${index}`}
                value={exp.description}
                onChange={(e) =>
                  handleExpertiseChange(index, "description", e.target.value)
                }
                className="mt-2"
                placeholder="Brief description of your responsibilities"
                rows={3}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(index)}
              className="mt-3 text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Experience
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={addExperience}
        className="flex items-center space-x-2 text-primary hover:text-primary/80"
      >
        <Plus className="w-4 h-4" />
        <span>Add Experience</span>
      </Button>
    </div>
  );
}
