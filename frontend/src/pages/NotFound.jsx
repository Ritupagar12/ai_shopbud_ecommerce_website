import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-lg space-y-6">
        {/* Error Code */}
        <h1 className="text-9xl font-extrabold text-primary">404</h1>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-foreground">
          Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground">
          Oops! The page you are looking for doesn’t exist or might have been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;