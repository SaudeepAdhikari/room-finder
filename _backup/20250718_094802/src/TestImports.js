// Test imports for UI components
import React from 'react';

// Test individual component imports
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Card from './components/ui/Card';
import Modal from './components/ui/Modal';
import Badge from './components/ui/Badge';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';

// Test icon imports
import { ChevronRightIcon, PlusIcon, SearchIcon, HeartIcon, BookmarkIcon } from './components/ui/Button';
import { UserIcon, MailIcon, PhoneIcon, LockIcon, CalendarIcon, MapPinIcon } from './components/ui/Input';
import { HomeIcon, BellIcon } from './components/ui/Navbar';

const TestImports = () => {
  return (
    <div>
      <h1>Testing UI Component Imports</h1>
      <Button>Test Button</Button>
      <Input placeholder="Test input" />
      <Footer variant="minimal" />
    </div>
  );
};

export default TestImports;
