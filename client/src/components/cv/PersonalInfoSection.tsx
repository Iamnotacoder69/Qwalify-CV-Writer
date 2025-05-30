import { useState, useEffect } from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  Form,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, Trash2, Upload } from "lucide-react";

type PersonalInfoSectionProps = {
  form: any;
};

const PersonalInfoSection = ({ form }: PersonalInfoSectionProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Get the current photoUrl value from the form with better error handling
  let photoUrl = "";
  try {
    photoUrl = form.watch("personal.photoUrl") || "";
  } catch (error) {
    console.error("Error watching photoUrl:", error);
  }
  
  // Update preview when photoUrl changes
  useEffect(() => {
    try {
      if (photoUrl) {
        setPhotoPreview(photoUrl);
      } else {
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error("Error in photoUrl effect:", error);
    }
  }, [photoUrl]);
  
  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file (PNG, JPG, JPEG)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      setPhotoPreview(result);
      form.setValue("personal.photoUrl", result);
    };
    reader.readAsDataURL(file);
  };
  
  // Remove the photo
  const removePhoto = () => {
    setPhotoPreview(null);
    form.setValue("personal.photoUrl", "");
  };
  
  // Get initials for avatar fallback with better error handling
  const getInitials = () => {
    try {
      const firstName = form.watch("personal.firstName") || '';
      const lastName = form.watch("personal.lastName") || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } catch (error) {
      console.error("Error generating initials:", error);
      return "";
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-5 sm:pt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#043e44] mb-4 sm:mb-6">Personal Information</h2>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 border-2 border-[#03d27c]/30">
              <AvatarImage src={photoPreview || ""} alt="Profile" />
              <AvatarFallback className="text-2xl bg-muted">{getInitials() || <Camera className="w-10 h-10 text-muted-foreground" />}</AvatarFallback>
            </Avatar>
            
            <div className="mt-3 flex flex-col gap-2">
              <Label htmlFor="photo-upload" className="w-full">
                <div className="flex items-center justify-center gap-2 bg-[#03d27c]/10 text-[#03d27c] rounded-md px-3 py-2 text-sm font-medium cursor-pointer hover:bg-[#03d27c]/20 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </Label>
              
              {photoPreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removePhoto}
                  className="border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
            
            {uploadError && (
              <p className="text-destructive text-xs mt-2">{uploadError}</p>
            )}
            
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-[200px]">
              Optional. Upload a professional photo for your CV. 
              Square format recommended.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
          <FormField
            control={form.control}
            name="personal.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#043e44] font-medium">First Name*</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#043e44] font-medium">Last Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.professionalTitle"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-[#043e44] font-medium">Professional Title*</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Your current job title or professional role (e.g., "Senior Project Manager")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#043e44] font-medium">Email*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#043e44] font-medium">Phone Number*</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.linkedin"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-[#043e44] font-medium">LinkedIn Profile</FormLabel>
                <FormControl>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#03d27c]/30 bg-[#03d27c]/5 text-[#043e44] text-sm">
                      linkedin.com/in/
                    </span>
                    <Input 
                      className="rounded-l-none" 
                      placeholder="johndoe" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
