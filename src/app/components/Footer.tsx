import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="text-center p-4 bg-gray-200">
            <p>&copy; {new Date().getFullYear()} Made with ❤️ using Prodia by Faeez</p>
        </footer>
    );
};

export default Footer;