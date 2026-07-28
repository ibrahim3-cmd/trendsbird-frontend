import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  className?: string;
  text?: string;
}

export const BackButton = ({ to = "/administration", className, text = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Fallback to browser's back function
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGoBack}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
};