import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SectionControllerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    controllerId: '',
    password: '',
    state: '',
    cityRegion: '',
    sectionCode: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    const value = field === 'rememberMe' ? e?.target?.checked : e?.target?.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to main dashboard after successful login
      navigate('/operations-control-center');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Geometric Design Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rotate-45"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rotate-12"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
                <Icon name="Train" size={32} color="white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Train-AI</h1>
                <div className="flex items-center mt-1">
                  <Icon name="Shield" size={16} className="mr-2" />
                  <span className="text-lg font-medium">IRCTC</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Intelligent Railway Operations Control
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Advanced AI-powered railway management system for section controllers and station masters. 
                Real-time monitoring, predictive analytics, and seamless coordination.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Icon name="Activity" size={24} className="mb-2" />
                  <div className="font-semibold">Real-time Monitoring</div>
                  <div className="text-sm text-white/70">Live train tracking & alerts</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Icon name="Brain" size={24} className="mb-2" />
                  <div className="font-semibold">AI Analytics</div>
                  <div className="text-sm text-white/70">Predictive insights & optimization</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-white/60 text-sm">
            © 2025 Indian Railway Catering and Tourism Corporation Limited
          </div>
        </div>
      </div>
      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mr-3">
                  <Icon name="Train" size={24} color="white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">Train-AI</div>
                  <div className="text-sm text-muted-foreground">IRCTC</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Section Controller Login
              </h3>
              <p className="text-muted-foreground">
                Access the railway operations control system
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Controller ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter your controller ID"
                  value={formData?.controllerId}
                  onChange={handleInputChange('controllerId')}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange('password')}
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    State
                  </label>
                  <select
                    value={formData?.state}
                    onChange={handleInputChange('state')}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="delhi">Delhi</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="rajasthan">Rajasthan</option>
                    <option value="west-bengal">West Bengal</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                    <option value="punjab">Punjab</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City/Region
                  </label>
                  <Input
                    type="text"
                    placeholder="City/Region"
                    value={formData?.cityRegion}
                    onChange={handleInputChange('cityRegion')}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Section Code
                </label>
                <Input
                  type="text"
                  placeholder="Enter section code (e.g., NR-01)"
                  value={formData?.sectionCode}
                  onChange={handleInputChange('sectionCode')}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData?.rememberMe}
                    onChange={handleInputChange('rememberMe')}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-foreground">Remember me</span>
                </label>
                
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Icon name="LogIn" size={18} className="mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Authorized personnel only</div>
                <div>For technical support, contact IT Help Desk: 1800-111-139</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionControllerLogin;