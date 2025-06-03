import React from 'react';
import Link from 'next/link';
import { LuGithub, LuMail, LuLinkedin, LuArrowUpRight } from 'react-icons/lu';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto py-16 px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-6">
                            <h3 className="font-bold text-xl">
                                <span className="text-gradient-animated">Prodia</span>
                                <span className="font-light">Studio</span>
                            </h3>
                        </div>
                        <p className="text-gray-600 max-w-md mb-6">
                            Professional AI image generation powered by advanced algorithms. 
                            Transform your concepts into high-quality visual content with precision and style.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors" aria-label="GitHub">
                                <LuGithub size={20} />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors" aria-label="Email">
                                <LuMail size={20} />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors" aria-label="LinkedIn">
                                <LuLinkedin size={20} />
                            </a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-gray-900 mb-6 text-lg">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center">Home <LuArrowUpRight size={14} className="ml-1 opacity-70" /></Link></li>
                            <li><Link href="/generate" className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center">Create Images <LuArrowUpRight size={14} className="ml-1 opacity-70" /></Link></li>
                            <li><Link href="/generated" className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center">Gallery <LuArrowUpRight size={14} className="ml-1 opacity-70" /></Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-gray-900 mb-6 text-lg">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">License</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} ProdiaStudio. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Made with precision by Faeez</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;