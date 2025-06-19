import { Button } from "@/components/ui/button";
import { useCVForm } from "./form-context";

export function ActionButtons({
  onUploadAnother,
}: {
  onUploadAnother: () => void;
}) {
  const { handleSave, handleExportPDF, handleReset } = useCVForm();

  return (
    <div className="space-y-6">      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          onClick={handleSave}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save Changes
        </Button>
        <Button onClick={handleExportPDF} variant="default" className="flex-1">
          Export PDF
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset Form
        </Button>
      </div>

      {/* Upload Another CV */}
      <div className="mt-6 text-center">
        <Button
          variant="link"
          onClick={onUploadAnother}
          className="text-primary hover:text-primary/80"
        >
          Upload Another CV
        </Button>
      </div>
    </div>
  );
}
