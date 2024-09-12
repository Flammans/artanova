const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Artanova. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
