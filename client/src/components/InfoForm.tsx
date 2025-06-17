import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CVData } from "@shared/schema";

interface InfoFormProps {
  extractedData: CVData;
  onUploadAnother: () => void;
}

interface ExpertiseItem {
  date: string;
  company: string;
  role: string;
}

export default function InfoForm({ extractedData, onUploadAnother }: InfoFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CVData>({
    ...extractedData,
    skills: [...extractedData.skills],
    expertise: [...extractedData.expertise]
  });

  const handleInputChange = (field: keyof CVData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setFormData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleExpertiseChange = (index: number, field: keyof ExpertiseItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, { date: '', company: '', role: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your CV information has been updated successfully.",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.first_name}_${formData.last_name}_CV_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "CV data has been downloaded as JSON file.",
    });
  };

  const handleReset = () => {
    setFormData({
      ...extractedData,
      skills: [...extractedData.skills],
      expertise: [...extractedData.expertise]
    });
    toast({
      title: "Form reset",
      description: "All changes have been reverted to original extracted data.",
    });
  };

  return (
    <div>
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Extracted Information</h2>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Successfully extracted</span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="mt-2"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="mt-2"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sex" className="text-sm font-medium text-gray-700">Sex</Label>
                  <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="mt-2"
                    placeholder="Primary language"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-2"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Education</h3>
              
              <div>
                <Label htmlFor="education" className="text-sm font-medium text-gray-700">Education Background</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="mt-2"
                  placeholder="University - Degree"
                />
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Skills</h3>
              
              <div>
                <Label htmlFor="skills" className="text-sm font-medium text-gray-700">Technical Skills</Label>
                <Input
                  id="skills"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="mt-2"
                  placeholder="Comma-separated skills (e.g., JavaScript, React, Python)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Professional Experience</h3>
              
              <div className="space-y-4">
                {formData.expertise.map((exp, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`date-${index}`} className="text-sm font-medium text-gray-700">Date Range</Label>
                        <Input
                          id={`date-${index}`}
                          value={exp.date}
                          onChange={(e) => handleExpertiseChange(index, 'date', e.target.value)}
                          className="mt-2"
                          placeholder="e.g., 2020 - 2022"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`company-${index}`} className="text-sm font-medium text-gray-700">Company</Label>
                        <Input
                          id={`company-${index}`}
                          value={exp.company}
                          onChange={(e) => handleExpertiseChange(index, 'company', e.target.value)}
                          className="mt-2"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`role-${index}`} className="text-sm font-medium text-gray-700">Role</Label>
                        <Input
                          id={`role-${index}`}
                          value={exp.role}
                          onChange={(e) => handleExpertiseChange(index, 'role', e.target.value)}
                          className="mt-2"
                          placeholder="Job title"
                        />
                      </div>
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

            {/* Summary Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Professional Summary</h3>
              
              <div>
                <Label htmlFor="summary" className="text-sm font-medium text-gray-700">Elevator Pitch</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  rows={4}
                  className="mt-2 resize-none"
                  placeholder="Brief professional summary..."
                />
                <p className="text-xs text-gray-500 mt-1">Provide a brief overview of your professional background and key strengths</p>
              </div>
            </div>

            {/* Action Buttons */}
            <Separator />
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </Button>
              <Button onClick={handleExport} variant="outline" className="flex-1">
                Export Data
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Reset Form
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Another CV */}
      <div className="mt-6 text-center">
        <Button variant="link" onClick={onUploadAnother} className="text-primary hover:text-primary/80">
          Upload Another CV
        </Button>
      </div>
    </div>
  );
}
