import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaUsers, FaRocket, FaHeart, FaAward, FaMapMarkedAlt, FaCalendarAlt } from 'react-icons/fa';
import './About.css';

const TEAM = [
    { name: 'Saudeep Adhikari', role: 'Founder & Developer', img: 'https://randomuser.me/api/portraits/men/1.jpg' },
];

const MILESTONES = [
    { year: '2021', text: 'SajiloStay founded in Kathmandu.', icon: <FaRocket /> },
    { year: '2022', text: '10,000+ rooms listed across Nepal.', icon: <FaMapMarkedAlt /> },
    { year: '2023', text: 'First 100,000 bookings milestone.', icon: <FaAward /> },
];

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

export default function About() {
    const { scrollY } = useScroll();

    // Parallax effects
    const heroParallaxY = useTransform(scrollY, [0, 300], [0, -50]);
    const missionParallaxY = useTransform(scrollY, [0, 400], [0, 30]);
    const teamParallaxY = useTransform(scrollY, [0, 500], [0, -40]);

    return (
        <main className="about-root" aria-labelledby="about-heading">
            {/* Animated Background */}
            <div className="about-bg-animation">
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

            <motion.section className="about-hero" role="region" aria-label="About SajiloStay" initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div
                    className="about-hero-bg"
                    aria-hidden="true"
                    style={{ y: heroParallaxY }}
                />
                <motion.div
                    className="about-hero-content"
                    variants={containerVariants}
                >
                    <motion.h1
                        id="about-heading"
                        className="about-title"
                        variants={itemVariants}
                    >
                        About SajiloStay
                    </motion.h1>
                    <motion.p
                        className="about-subtitle"
                        variants={itemVariants}
                    >
                        Nepal's trusted platform for finding and booking rooms, designed to make your journey simple, safe, and memorable.
                    </motion.p>
                </motion.div>
            </motion.section>

            <motion.section className="about-mission" aria-label="Our Mission" initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div
                    className="about-mission-inner"
                    style={{ y: missionParallaxY }}
                >
                    <motion.h2
                        className="about-section-title"
                        variants={itemVariants}
                    >
                        <AnimatedIcon type="pulse" delay={0.2}>
                            <FaHeart style={{ marginRight: '12px', color: '#ef4444' }} />
                        </AnimatedIcon>
                        Our Mission
                    </motion.h2>
                    <motion.p
                        className="about-mission-text"
                        variants={itemVariants}
                    >
                        SajiloStay is on a mission to revolutionize how people find and book accommodations in Nepal. We believe in making travel and relocation stress-free, transparent, and enjoyable for everyone—travelers, students, and locals alike.
                    </motion.p>
                </motion.div>
            </motion.section>

            <motion.section className="about-description" aria-label="Brand Story" initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div
                    className="about-description-inner"
                    variants={containerVariants}
                >
                    <motion.p variants={itemVariants}>
                        Founded in Kathmandu, SajiloStay connects people with the perfect space—whether for a night, a semester, or a new beginning. Our platform is built on trust, simplicity, and a passion for helping our community thrive.
                    </motion.p>
                    <motion.p variants={itemVariants}>
                        We're proud to support local hosts, empower renters, and foster a vibrant, safe, and welcoming community across Nepal.
                    </motion.p>
                </motion.div>
            </motion.section>

            <motion.section className="about-milestones" aria-label="Milestones" initial="hidden" animate="visible" variants={containerVariants}>
                <motion.h2
                    className="about-section-title"
                    variants={itemVariants}
                >
                    <AnimatedIcon type="float" delay={0.3}>
                        <FaAward style={{ marginRight: '12px', color: '#f59e0b' }} />
                    </AnimatedIcon>
                    Milestones
                </motion.h2>
                <motion.ul
                    className="about-milestone-list"
                    variants={containerVariants}
                >
                    {MILESTONES.map((milestone, i) => (
                        <motion.li
                            key={i}
                            className="about-milestone-item"
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)'
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <motion.span
                                className="about-milestone-year"
                                variants={itemVariants}
                            >
                                <AnimatedIcon type="pulse" delay={i * 0.2}>
                                    {milestone.icon}
                                </AnimatedIcon>
                                {milestone.year}
                            </motion.span>
                            <motion.span
                                className="about-milestone-text"
                                variants={itemVariants}
                            >
                                {milestone.text}
                            </motion.span>
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.section>

            <motion.section className="about-team" aria-label="Meet the Team" initial="hidden" animate="visible" variants={containerVariants}>
                <motion.h2
                    className="about-section-title"
                    variants={itemVariants}
                >
                    <AnimatedIcon type="float" delay={0.4}>
                        <FaUsers style={{ marginRight: '12px', color: '#3b82f6' }} />
                    </AnimatedIcon>
                    Meet the Team
                </motion.h2>
                <motion.div
                    className="about-team-grid"
                    style={{ y: teamParallaxY }}
                    variants={containerVariants}
                >
                    {TEAM.map((member, i) => (
                        <motion.figure
                            className="about-team-member"
                            key={i}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.08,
                                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)'
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <motion.img
                                src={member.img}
                                alt={member.name}
                                className="about-team-img"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.figcaption
                                variants={itemVariants}
                            >
                                <motion.span
                                    className="about-team-name"
                                    whileHover={{ color: '#7c3aed' }}
                                >
                                    {member.name}
                                </motion.span>
                                <motion.span
                                    className="about-team-role"
                                    whileHover={{ color: '#6b7280' }}
                                >
                                    {member.role}
                                </motion.span>
                            </motion.figcaption>
                        </motion.figure>
                    ))}
                </motion.div>
            </motion.section>
        </main>
    );
} 