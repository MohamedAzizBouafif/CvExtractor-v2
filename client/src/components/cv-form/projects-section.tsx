import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useCVForm, useCVFormActions } from "./form-context";

export function ProjectsSection() {  const { formData, updateNestedField, updateArrayField } = useCVForm();
  const { addProject, removeProject } = useCVFormActions();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Projects
      </h3>

      <div className="space-y-4">
        {formData.projects.map((project, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor={`project-name-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Project Name
                </Label>
                <Input
                  id={`project-name-${index}`}
                  value={project.project_name}
                  onChange={(e) =>
                    updateNestedField("projects", index, "project_name", e.target.value)
                  }
                  className="mt-2"
                  placeholder="Project name"
                />
              </div>
              <div>
                <Label
                  htmlFor={`industry-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Industry
                </Label>
                <Input
                  id={`industry-${index}`}
                  value={project.industry}
                  onChange={(e) =>
                    updateNestedField("projects", index, "industry", e.target.value)
                  }
                  className="mt-2"
                  placeholder="e.g., Finance, Healthcare"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label
                  htmlFor={`country-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Country
                </Label>
                <Input
                  id={`country-${index}`}
                  value={project.country}
                  onChange={(e) =>
                    updateNestedField("projects", index, "country", e.target.value)
                  }
                  className="mt-2"
                  placeholder="Country"
                />
              </div>
              <div>
                <Label
                  htmlFor={`project-role-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Role
                </Label>
                <Input
                  id={`project-role-${index}`}
                  value={project.role}
                  onChange={(e) =>
                    updateNestedField("projects", index, "role", e.target.value)
                  }
                  className="mt-2"
                  placeholder="Your role in the project"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label
                htmlFor={`phases-${index}`}
                className="text-sm font-medium text-gray-700"
              >
                Project Phases
              </Label>
              <Input
                id={`phases-${index}`}
                value={
                  Array.isArray(project.phases) ? project.phases.join(", ") : ""
                }
                onChange={(e) =>
                  updateNestedField("projects", index, "phases", 
                    e.target.value.split(",").map(p => p.trim()).filter(p => p.length > 0)
                  )
                }
                className="mt-2"
                placeholder="Comma-separated phases (e.g., Design, Development, Testing)"
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeProject(index)}
              className="mt-3 text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Project
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={addProject}
        className="flex items-center space-x-2 text-primary hover:text-primary/80"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </Button>
    </div>
  );
}
