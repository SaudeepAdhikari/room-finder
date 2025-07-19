import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaTwitter, FaUser, FaComments, FaBuilding, FaNewspaper } from 'react-icons/fa';
import './Contact.css';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.25,
            ease: "easeOut"
        }
    }
};

const AnimatedIcon = ({ children, type = "float", delay = 0 }) => {
    const iconVariants = {
        float: {
            y: [0, -8, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }
        },
        pulse: {
            scale: [1, 1.1, 1],
            transition: {
                duration: 1,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div variants={iconVariants} animate={type}>
            {children}
        </motion.div>
    );
};

const DEPARTMENTS = [
    { name: 'General Support', icon: <FaComments />, color: '#3b82f6' },
    { name: 'Room Listings', icon: <FaBuilding />, color: '#8b5cf6' },
    { name: 'Partnerships', icon: <FaUser />, color: '#10b981' },
    { name: 'Press & Media', icon: <FaNewspaper />, color: '#f59e0b' },
];

export default function Contact() {
    const { scrollY } = useScroll();

    // Parallax effects
    const heroParallaxY = useTransform(scrollY, [0, 300], [0, -50]);
    const formParallaxY = useTransform(scrollY, [0, 400], [0, 30]);

    return (
        <main className="contact-root" aria-labelledby="contact-heading">
            {/* Animated Background */}
            <div className="contact-bg-animation">
                <motion.div
                    className="floating-shape shape-1"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="floating-shape shape-2"
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -3, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="floating-shape shape-3"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 2, 0]
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <motion.section
                className="contact-hero"
                role="region"
                aria-label="Contact Us"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    style={{ y: heroParallaxY }}
                    variants={containerVariants}
                >
                    <motion.h1
                        id="contact-heading"
                        className="contact-title"
                        variants={itemVariants}
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        className="contact-subtitle"
                        variants={itemVariants}
                    >
                        We're here to help! Reach out to our support team and we'll get back to you as soon as possible.
                    </motion.p>
                </motion.div>
            </motion.section>

            <motion.section
                className="contact-options"
                aria-label="Contact Options"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="contact-option-list"
                    variants={containerVariants}
                >
                    <motion.div
                        className="contact-option"
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <motion.span
                            className="contact-option-label"
                            whileHover={{ color: '#3b82f6' }}
                        >
                            <AnimatedIcon type="pulse" delay={0.2}>
                                <FaEnvelope style={{ marginRight: '8px' }} />
                            </AnimatedIcon>
                            Email
                        </motion.span>
                        <motion.a
                            href="mailto:support@sajilostay.com"
                            className="contact-option-value"
                            whileHover={{ color: '#3b82f6' }}
                        >
                            support@sajilostay.com
                        </motion.a>
                    </motion.div>

                    <motion.div
                        className="contact-option"
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <motion.span
                            className="contact-option-label"
                            whileHover={{ color: '#8b5cf6' }}
                        >
                            <AnimatedIcon type="pulse" delay={0.4}>
                                <FaPhone style={{ marginRight: '8px' }} />
                            </AnimatedIcon>
                            Phone
                        </motion.span>
                        <motion.a
                            href="tel:+977-9842064469"
                            className="contact-option-value"
                            whileHover={{ color: '#8b5cf6' }}
                        >
                            +977-9842064469
                        </motion.a>
                    </motion.div>

                    <motion.div
                        className="contact-option"
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <motion.span
                            className="contact-option-label"
                            whileHover={{ color: '#10b981' }}
                        >
                            <AnimatedIcon type="pulse" delay={0.6}>
                                <FaFacebook style={{ marginRight: '8px' }} />
                            </AnimatedIcon>
                            Social
                        </motion.span>
                        <motion.div
                            className="contact-social-links"
                            variants={containerVariants}
                        >
                            <motion.a
                                href="#"
                                aria-label="Facebook"
                                className="contact-social-icon"
                                whileHover={{ scale: 1.2, color: '#1877f2' }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <FaFacebook />
                            </motion.a>
                            <motion.a
                                href="#"
                                aria-label="Instagram"
                                className="contact-social-icon"
                                whileHover={{ scale: 1.2, color: '#e4405f' }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <FaInstagram />
                            </motion.a>
                            <motion.a
                                href="#"
                                aria-label="Twitter"
                                className="contact-social-icon"
                                whileHover={{ scale: 1.2, color: '#1da1f2' }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <FaTwitter />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>

            <motion.section
                className="contact-form-section"
                aria-label="Contact Form"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.form
                    className="contact-form"
                    autoComplete="off"
                    onSubmit={e => e.preventDefault()}
                    style={{ y: formParallaxY }}
                    variants={containerVariants}
                >
                    <motion.h2
                        className="contact-form-title"
                        variants={itemVariants}
                    >
                        Send Us a Message
                    </motion.h2>

                    <motion.div
                        className="contact-form-group"
                        variants={itemVariants}
                    >
                        <label htmlFor="name" className="contact-form-label">Name</label>
                        <motion.input
                            type="text"
                            id="name"
                            name="name"
                            className="contact-form-input"
                            placeholder="Your Name"
                            required
                            whileFocus={{
                                scale: 1.02,
                                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                            }}
                        />
                    </motion.div>

                    <motion.div
                        className="contact-form-group"
                        variants={itemVariants}
                    >
                        <label htmlFor="email" className="contact-form-label">Email</label>
                        <motion.input
                            type="email"
                            id="email"
                            name="email"
                            className="contact-form-input"
                            placeholder="you@email.com"
                            required
                            whileFocus={{
                                scale: 1.02,
                                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                            }}
                        />
                    </motion.div>

                    <motion.div
                        className="contact-form-group"
                        variants={itemVariants}
                    >
                        <label htmlFor="message" className="contact-form-label">Message</label>
                        <motion.textarea
                            id="message"
                            name="message"
                            className="contact-form-input"
                            placeholder="How can we help you?"
                            rows={5}
                            required
                            whileFocus={{
                                scale: 1.02,
                                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                            }}
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="contact-form-submit"
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        Send Message
                    </motion.button>
                </motion.form>
            </motion.section>

            <motion.section
                className="contact-departments"
                aria-label="Departments"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.h2
                    className="contact-section-title"
                    variants={itemVariants}
                >
                    <AnimatedIcon type="float" delay={0.3}>
                        <FaBuilding style={{ marginRight: '12px', color: '#8b5cf6' }} />
                    </AnimatedIcon>
                    Departments
                </motion.h2>

                <motion.ul
                    className="contact-department-list"
                    variants={containerVariants}
                >
                    {DEPARTMENTS.map((dept, i) => (
                        <motion.li
                            key={i}
                            className="contact-department-item"
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: `0 8px 32px ${dept.color}22`
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <motion.span
                                variants={itemVariants}
                                whileHover={{ color: dept.color }}
                            >
                                <AnimatedIcon type="pulse" delay={i * 0.2}>
                                    <span style={{ color: dept.color, marginRight: '8px' }}>
                                        {dept.icon}
                                    </span>
                                </AnimatedIcon>
                                {dept.name}
                            </motion.span>
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.section>
        </main>
    );
} 