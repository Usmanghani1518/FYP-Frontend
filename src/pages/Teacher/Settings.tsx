import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash } from "lucide-react";

// Form validation schema
const profileFormSchema = z.object({
  headline: z.string().min(5, {
    message: "Headline must be at least 5 characters.",
  }),
  bio: z.string().max(500).optional(),
  experience: z.enum(["beginner", "intermediate", "professional"]),
  socialAccounts: z.array(
    z.object({
      platform: z.enum(["facebook", "twitter", "linkedin"]),
      url: z.string().url({ message: "Please enter a valid URL." }),
    })
  ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function TeacherSettingsPage() {
  // Mock data - in a real app, this would come from your API
  const defaultValues: Partial<ProfileFormValues> = {
    headline: "Mathematics Professor with 10+ years of experience",
    bio: "Passionate about making complex mathematical concepts accessible to all students.",
    experience: "professional",
    socialAccounts: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/example",
      },
    ],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "socialAccounts",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated successfully",
      description: "Your changes have been saved.",
    });
    console.log(data);
    // Here you would typically call your API to update the teacher profile
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div>
        <h3 className="text-lg font-medium">Teacher Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your public teacher profile information.
        </p>
      </div>
      <Separator />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Picture Section */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Profile Picture</h4>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/default-avatar.png" />
                <AvatarFallback>TP</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Change
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Remove
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. Max size of 2MB
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-2/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your professional headline"
                        {...field}
                        className="max-w-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell students about yourself and your teaching approach"
                        className="resize-none max-w-lg"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/500 characters
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel>Experience Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Social Accounts</h4>
                  <p className="text-sm text-muted-foreground">
                    Add links to your professional social media profiles.
                  </p>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`socialAccounts.${index}.platform`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`socialAccounts.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="https://example.com/yourprofile"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ platform: "facebook", url: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Social Account
                </Button>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function useFieldArray(arg0: { name: string; control: any; }) {
    throw new Error("Function not implemented.");
}