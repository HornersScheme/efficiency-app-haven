import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Terms = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
    <Header />
    <main className="flex-1 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 max-w-3xl"
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Legal</Badge>
              <h1 className="text-4xl font-bold text-gray-800">Terms of Service</h1>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">
                <strong>Last updated:</strong> [2025-05-07]
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg text-gray-600 space-y-8">
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Use of the Site</h2>
                <p className="leading-relaxed">EfficiencyHub is a platform for submitting and discovering productivity tools. By using this site, you agree to use it only for legal, respectful purposes and not to spam or abuse the platform.</p>
                <Separator className="my-6" />
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Tool Submissions</h2>
                <p className="leading-relaxed">You're responsible for the content you submit. Submissions must be your own or something you have the right to share. We reserve the right to remove submissions that violate our guidelines.</p>
                <Separator className="my-6" />
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Accounts</h2>
                <p className="leading-relaxed">To create an account, you must provide a valid email. You're responsible for your activity on the platform and should not share your login credentials.</p>
                <Separator className="my-6" />
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Limitation of Liability</h2>
                <p className="leading-relaxed">We are not responsible for any third-party tools listed on the platform. Use any tool at your own discretion. We do not guarantee the accuracy, reliability, or safety of tools submitted by users.</p>
                <Separator className="my-6" />
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Changes</h2>
                <p className="leading-relaxed">We may update these Terms and the Privacy Policy periodically. Continued use of the platform means you accept the updated terms.</p>
                <Separator className="my-6" />
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Contact</h2>
                <p className="leading-relaxed">
                  <a 
                    href="mailto:3lsh916@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <span>3lsh916@gmail.com</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                  </a>
                </p>
              </motion.section>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
    <Footer />
  </div>
);

export default Terms; 