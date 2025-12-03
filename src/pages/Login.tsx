import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appService } from "@/lib/api/service";
import { loginSuccess } from "@/store/authSlice";
import { RootState } from "@/store";
import AnimatedFace from "@/components/AnimatedFace";

const Login = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isAuthenticated, expiry } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && Date.now() < expiry) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, expiry, navigate]);

  const loginMutation = useMutation({
    mutationFn: () => appService.adminAuth({ email, password }),
    onSuccess: (data) => {
      console.log(data)
      dispatch(loginSuccess({ user: data.data.admin, token: data.data.token }));
      toast({
        title: "Login Successful",
        description: "Welcome to the Event Management Dashboard!",
      });
      queryClient.invalidateQueries({
        queryKey: ["admin login"],
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error.message);
      toast({
        title: "Login Failed",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    if (email && password) {
      loginMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Animated Face */}
        <div className="flex justify-center mb-8">
          <AnimatedFace 
            isPasswordFocused={isPasswordFocused}
            isPasswordHovered={isPasswordHovered}
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@enyconsulting.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => {
                  setIsPasswordFocused(true);
                  setIsPasswordHovered(false);
                }}
                onBlur={() => {
                  setIsPasswordFocused(false);
                  setIsPasswordHovered(false);
                }}
                onMouseEnter={() => setIsPasswordHovered(true)}
                onMouseLeave={() => setIsPasswordHovered(false)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
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
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <style>{`
          @keyframes blink {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.1); }
          }
          .animate-blink {
            animation: blink 0.3s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Login;
