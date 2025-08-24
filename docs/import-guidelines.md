# Import Guidelines for Room Finder

This document outlines the best practices for handling imports in the Room Finder project to maintain consistency and avoid compilation errors.

## Import Order

Follow this order for your imports:

1. React and React-related libraries
2. Third-party libraries
3. Local components, hooks, and utilities
4. Stylesheets

Example:

```javascript
// 1. React and related libraries
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// 2. Third-party libraries
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

// 3. Local components, hooks, and utilities
import { useUser } from "../context/UserContext";
import RoomCard from "../components/RoomCard";

// 4. Stylesheets
import "../styles/HomePage.css";
```

## Using Relative Paths

When importing local files, use relative paths:

```javascript
// Good - using relative paths
import { useUser } from "../context/UserContext";
import RoomCard from "./RoomCard";
import { fadeInUp } from "../../utils/animations";

// Bad - using @ alias (currently not properly configured)
import { useUser } from "@/context";
import RoomCard from "@/components/RoomCard";
```

## Context Imports

When importing context hooks, import directly from the specific context file:

```javascript
// Good
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

// Bad
import { useUser, useToast, useTheme } from "../context";
```

## Utility Imports

Import only the specific utilities you need:

```javascript
// Good - importing only what you need
import { fadeInUp, staggerContainer } from "../utils/animations";

// Bad - importing everything
import * as animations from "../utils/animations";
```

## Future Improvements

We plan to properly configure path aliases with a jsconfig.json file in the future. Once implemented, these guidelines will be updated.
