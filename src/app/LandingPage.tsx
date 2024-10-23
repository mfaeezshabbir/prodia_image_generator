/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BiRocket, BiSolidDownload, BiImageAdd } from 'react-icons/bi';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import Link from 'next/link';
import Image from 'next/image';
import TypeEffect from './components/Typeeffect';

const LandingPage = () => {
    return (
        <div className="bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500 min-h-screen text-white">
            {/* Hero Section */}
            <section className="text-center py-20 px-6">
                <h1 className="text-6xl font-bold leading-tight">
                    <TypeEffect
                        textArray={[
                            'Unleash Your Creativity!',
                            'Create Stunning AI Images!',
                            'Turn Your Imagination into Reality!',
                        ]}
                        typingSpeed={120}
                        delay={2500}
                    />
                </h1>
                <p className="mt-6 text-xl">
                    Generate mind-blowing images with the power of AI, in just a few clicks.
                </p>
                <Link href="/generate" className="mt-8 inline-block bg-yellow-500 hover:bg-yellow-400 text-black text-xl font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
                    Get Started for Free
                </Link>
                {/* <div className="mt-8 flex justify-center space-x-4">
                    <a href="#" className="hover:underline">
                        Explore Features
                    </a>
                    <a href="#" className="hover:underline">
                        View Examples
                    </a>
                </div> */}
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-4xl font-semibold mb-8">Why Choose Our AI Image Generator?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Feature 1 */}
                    <div className="flex flex-col justify-center items-center bg-white text-black p-8 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
                        <BiRocket className="text-6xl text-purple-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Fast and Powerful</h3>
                        <p>
                            Generate high-quality images in seconds using cutting-edge AI technology.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col justify-center items-center bg-white text-black p-8 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
                        <AiOutlineThunderbolt className="text-6xl text-yellow-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Real-time Previews</h3>
                        <p>
                            Preview your AI-generated images instantly, right in the app.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col justify-center items-center bg-white text-black p-8 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
                        <BiImageAdd className="text-6xl text-green-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Infinite Creativity</h3>
                        <p>
                            Unleash endless possibilities with customizable prompts and styles.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="flex flex-col justify-center items-center bg-white text-black p-8 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
                        <BiSolidDownload className="text-6xl text-blue-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Download and Share</h3>
                        <p>
                            Download your creations and share them with the world in just one click.
                        </p>
                    </div>
                </div>
            </section>

            {/* Example Image Section */}
            {/* <section className="py-20 px-6">
                <h2 className="text-4xl font-semibold text-center mb-12">Check Out Some AI-generated Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="relative group">
                        <Image
                            src="/images/sample1.jpg"
                            alt="AI Generated Image 1"
                            width={400}
                            height={400}
                            className="rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-lg">
                            <p className="text-white text-xl font-semibold">View Image</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <Image
                            src="/images/sample2.jpg"
                            alt="AI Generated Image 2"
                            width={400}
                            height={400}
                            className="rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-lg">
                            <p className="text-white text-xl font-semibold">View Image</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <Image
                            src="/images/sample3.jpg"
                            alt="AI Generated Image 3"
                            width={400}
                            height={400}
                            className="rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-lg">
                            <p className="text-white text-xl font-semibold">View Image</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <Image
                            src="/images/sample4.jpg"
                            alt="AI Generated Image 4"
                            width={400}
                            height={400}
                            className="rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-lg">
                            <p className="text-white text-xl font-semibold">View Image</p>
                        </div>
                    </div>
                </div>
            </section> */}

        </div>
    );
};

export default LandingPage;