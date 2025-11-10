import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Calendar } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { appService } from "@/lib/api/service";
import { loginSuccess } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Link",
        description: "No token provided in the URL.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [token, navigate, toast]);

  const setPasswordMutation = useMutation({
    mutationFn: () => appService.setPassword({ token: token!, password }),
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.data.admin, token: data.data.token }));

      toast({
        title: "Password Set Successfully",
        description: "You can now log in with your new password.",
      });

      navigate("/");
    },
    onError: (error: any) => {
      console.error("Set password error:", error.message);
      toast({
        title: "Failed to Set Password",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setPasswordMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <Card className="shadow-elevated">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Set Your Password
            </CardTitle>
            <CardDescription>
              Enter a new password for your admin account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-primary"
                disabled={isLoading}
              >
                {isLoading ? "Setting Password..." : "Set Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetPassword;
