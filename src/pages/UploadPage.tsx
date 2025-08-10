import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    course: "",
    professor: "",
    semester: "",
    description: "",
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      // Reset form after successful upload
      setFile(null);
      setFormData({
        course: "",
        professor: "",
        semester: "",
        description: "",
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <>
    <Header />
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gt-gold">Upload Notes</h1>
        <p className="text-center text-muted-foreground mb-8">
          Share your study materials with the GT community
        </p>

        <form onSubmit={handleSubmit}>
          <Card className="border-gt-gold/20">
            <CardHeader>
              <CardTitle className="text-gt-gold">Upload Your File</CardTitle>
              <CardDescription>
                Upload your lecture notes, study guides, or other course materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Dropzone */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-gt-gold bg-gt-gold/5' : 'border-gray-300 hover:border-gt-gold/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-10 w-10 text-gt-gold mb-2" />
                  {isDragActive ? (
                    <p className="text-gt-gold font-medium">Drop the file here</p>
                  ) : (
                    <>
                      <p className="font-medium">Drag & drop a file here, or click to select</p>
                      <p className="text-sm text-muted-foreground">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Selected File Preview */}
              {file && (
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gt-gold" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course" className="text-gt-gold">Course</Label>
                  <Input
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    placeholder="e.g., CS 1331"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professor" className="text-gt-gold">Professor</Label>
                  <Input
                    id="professor"
                    name="professor"
                    value={formData.professor}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Smith"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester" className="text-gt-gold">Semester</Label>
                <Select 
                  value={formData.semester} 
                  onValueChange={(value) => handleSelectChange(value, 'semester')}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring-2024">Spring 2024</SelectItem>
                    <SelectItem value="fall-2023">Fall 2023</SelectItem>
                    <SelectItem value="summer-2023">Summer 2023</SelectItem>
                    <SelectItem value="spring-2023">Spring 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gt-gold">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add a brief description of your notes..."
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!file || isUploading}
                className="bg-gt-gold hover:bg-gt-gold/90 text-white"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Upload Successful!
                  </>
                ) : (
                  'Upload Notes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>By uploading, you agree to our community guidelines and confirm that you have the right to share this content.</p>
        </div>
      </div>
    </div>
    </>
  );
}
