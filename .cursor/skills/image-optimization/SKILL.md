---
name: image-optimization
description: Audit and optimize image assets for performance
trigger: automatic
---

# Image Optimization Skill

This skill audits image assets for size and performance issues.

## Purpose

Audit and optimize image assets for performance, identifying files that exceed size thresholds and need optimization.

## Trigger Conditions

- **Automatic**: When images are added to `src/assets/`
- **Manual**: Invoked by `/optimize-assets` command

## Actions

1. **List Assets**:
   - Scan `src/assets/images` (if it exists) or `src/assets/projects/` for image files
   - Identify all image files (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`)

2. **Size Audit**:
   - Check file sizes for all images
   - Identify any files over 500KB
   - List files with their sizes for user review

3. **Summary Report**:
   - Present findings to the user:
     - Total number of images found
     - Number of images exceeding 500KB
     - List of oversized files with their sizes
   - Suggest optimization strategies:
     - Convert to WebP format
     - Compress images
     - Resize large images
     - Use responsive image techniques

4. **Warnings**:
   - Warn the user if any image exceeds 500KB
   - Suggest specific optimization steps for each oversized file

## Implementation Details

- Check file sizes using filesystem operations
- Focus on `src/assets/projects/` as the primary location for project images
- Consider both individual files and nested directories
- Provide actionable recommendations for each oversized file

## Notes

- The 500KB threshold is based on portfolio performance best practices
- Large images should be optimized before deployment
- Consider using Eleventy Image plugin for automatic optimization during build
