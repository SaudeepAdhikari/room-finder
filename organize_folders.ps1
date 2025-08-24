
# Project Reorganization Script
# Generated: 2025-07-24T11:54:07.878Z
# 
# This script will move files according to the project organization plan.
# Review before running!

# Create required directories
New-Item -Path "src\components" -ItemType Directory -Force
New-Item -Path "src\components\cards" -ItemType Directory -Force
New-Item -Path "src\components\forms" -ItemType Directory -Force
New-Item -Path "src\components\ui" -ItemType Directory -Force
New-Item -Path "src\layouts" -ItemType Directory -Force

# Move files to their new locations

# Move root components to components folder
Move-Item -Path "E:\Room Finder\room\src\AboutPage.js" -Destination "E:\Room Finder\room\src\components\AboutPage.js" -Force
Move-Item -Path "E:\Room Finder\room\src\AmenitiesList.js" -Destination "E:\Room Finder\room\src\components\AmenitiesList.js" -Force
Move-Item -Path "E:\Room Finder\room\src\App.js" -Destination "E:\Room Finder\room\src\components\App.js" -Force
Move-Item -Path "E:\Room Finder\room\src\ColorPaletteShowcase.js" -Destination "E:\Room Finder\room\src\components\ColorPaletteShowcase.js" -Force
Move-Item -Path "E:\Room Finder\room\src\ContactHostButton.js" -Destination "E:\Room Finder\room\src\components\ContactHostButton.js" -Force
Move-Item -Path "E:\Room Finder\room\src\ContactPage.js" -Destination "E:\Room Finder\room\src\components\ContactPage.js" -Force
Move-Item -Path "E:\Room Finder\room\src\DesignSystemPage.js" -Destination "E:\Room Finder\room\src\components\DesignSystemPage.js" -Force
Move-Item -Path "E:\Room Finder\room\src\EnvTest.js" -Destination "E:\Room Finder\room\src\components\EnvTest.js" -Force
Move-Item -Path "E:\Room Finder\room\src\FeaturedProperties.js" -Destination "E:\Room Finder\room\src\components\FeaturedProperties.js" -Force
Move-Item -Path "E:\Room Finder\room\src\FooterDemo.js" -Destination "E:\Room Finder\room\src\components\FooterDemo.js" -Force
Move-Item -Path "E:\Room Finder\room\src\HomePage.js" -Destination "E:\Room Finder\room\src\components\HomePage.js" -Force
Move-Item -Path "E:\Room Finder\room\src\ListingsGrid.js" -Destination "E:\Room Finder\room\src\components\ListingsGrid.js" -Force
Move-Item -Path "E:\Room Finder\room\src\PopularCities.js" -Destination "E:\Room Finder\room\src\components\PopularCities.js" -Force
Move-Item -Path "E:\Room Finder\room\src\PostRoomPage.js" -Destination "E:\Room Finder\room\src\components\PostRoomPage.js" -Force
Move-Item -Path "E:\Room Finder\room\src\PropertyShowcase.js" -Destination "E:\Room Finder\room\src\components\PropertyShowcase.js" -Force
Move-Item -Path "E:\Room Finder\room\src\ReviewsSection.js" -Destination "E:\Room Finder\room\src\components\ReviewsSection.js" -Force
Move-Item -Path "E:\Room Finder\room\src\RoomCard.js" -Destination "E:\Room Finder\room\src\components\RoomCard.js" -Force
Move-Item -Path "E:\Room Finder\room\src\RoomInfo.js" -Destination "E:\Room Finder\room\src\components\RoomInfo.js" -Force
Move-Item -Path "E:\Room Finder\room\src\SearchFilterShowcase.js" -Destination "E:\Room Finder\room\src\components\SearchFilterShowcase.js" -Force
Move-Item -Path "E:\Room Finder\room\src\SearchPage.js" -Destination "E:\Room Finder\room\src\components\SearchPage.js" -Force
Move-Item -Path "E:\Room Finder\room\src\Testimonials.js" -Destination "E:\Room Finder\room\src\components\Testimonials.js" -Force
Move-Item -Path "E:\Room Finder\room\src\TestImports.js" -Destination "E:\Room Finder\room\src\components\TestImports.js" -Force
Move-Item -Path "E:\Room Finder\room\src\UIShowcase.js" -Destination "E:\Room Finder\room\src\components\UIShowcase.js" -Force
Move-Item -Path "E:\Room Finder\room\src\Upload360Form.js" -Destination "E:\Room Finder\room\src\components\Upload360Form.js" -Force

# Move component CSS files to components folder
Move-Item -Path "E:\Room Finder\room\src\App.css" -Destination "E:\Room Finder\room\src\components\App.css" -Force
Move-Item -Path "E:\Room Finder\room\src\ColorPaletteShowcase.css" -Destination "E:\Room Finder\room\src\components\ColorPaletteShowcase.css" -Force
Move-Item -Path "E:\Room Finder\room\src\DesignSystemPage.css" -Destination "E:\Room Finder\room\src\components\DesignSystemPage.css" -Force
Move-Item -Path "E:\Room Finder\room\src\FooterDemo.css" -Destination "E:\Room Finder\room\src\components\FooterDemo.css" -Force
Move-Item -Path "E:\Room Finder\room\src\PostRoomPage.css" -Destination "E:\Room Finder\room\src\components\PostRoomPage.css" -Force
Move-Item -Path "E:\Room Finder\room\src\PropertyShowcase.css" -Destination "E:\Room Finder\room\src\components\PropertyShowcase.css" -Force
Move-Item -Path "E:\Room Finder\room\src\RoomCard.css" -Destination "E:\Room Finder\room\src\components\RoomCard.css" -Force
Move-Item -Path "E:\Room Finder\room\src\SearchFilterShowcase.css" -Destination "E:\Room Finder\room\src\components\SearchFilterShowcase.css" -Force
Move-Item -Path "E:\Room Finder\room\src\UIShowcase.css" -Destination "E:\Room Finder\room\src\components\UIShowcase.css" -Force

# Move UI components to ui subfolder
Move-Item -Path "E:\Room Finder\room\src\components\AnimatedButton.js" -Destination "E:\Room Finder\room\src\components\ui\AnimatedButton.js" -Force
Move-Item -Path "E:\Room Finder\room\src\components\ThemeToggle.css" -Destination "E:\Room Finder\room\src\components\ui\ThemeToggle.css" -Force
Move-Item -Path "E:\Room Finder\room\src\components\ThemeToggle.js" -Destination "E:\Room Finder\room\src\components\ui\ThemeToggle.js" -Force

# Move layout components to layouts folder
Move-Item -Path "E:\Room Finder\room\src\components\ModernNavbar.css" -Destination "E:\Room Finder\room\src\layouts\ModernNavbar.css" -Force
Move-Item -Path "E:\Room Finder\room\src\components\ModernNavbar.js" -Destination "E:\Room Finder\room\src\layouts\ModernNavbar.js" -Force
Move-Item -Path "E:\Room Finder\room\src\components\UniversalNavbar.js" -Destination "E:\Room Finder\room\src\layouts\UniversalNavbar.js" -Force
Move-Item -Path "E:\Room Finder\room\src\components\UserSidebar.js" -Destination "E:\Room Finder\room\src\layouts\UserSidebar.js" -Force

# Move form components to forms subfolder
Move-Item -Path "E:\Room Finder\room\src\components\MultiStepForm.js" -Destination "E:\Room Finder\room\src\components\forms\MultiStepForm.js" -Force

# Move card components to cards subfolder
Move-Item -Path "E:\Room Finder\room\src\components\PropertyCard.css" -Destination "E:\Room Finder\room\src\components\cards\PropertyCard.css" -Force
Move-Item -Path "E:\Room Finder\room\src\components\PropertyCard.js" -Destination "E:\Room Finder\room\src\components\cards\PropertyCard.js" -Force
