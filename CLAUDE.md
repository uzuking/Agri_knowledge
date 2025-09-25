# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an academic R project focused on agricultural knowledge and data visualization, specifically analyzing the relationship between light intensity and tomato yield. The project creates presentations using Quarto and includes data analysis scripts for agricultural research.

## Project Structure

- **R Scripts**: Main analysis code in R files (e.g., `tomato_yeald_light.R`)
- **Quarto Presentations**: `.qmd` files for creating presentations (`presen_test.qmd`)
- **Generated Content**: HTML presentations, PNG charts, and analysis outputs
- **R Project**: Standard RStudio project structure with `.Rproj` file

## Key Commands

### R Development
```bash
# Run R scripts
Rscript tomato_yeald_light.R

# Open in R console
R
```

### Quarto Presentations
```bash
# Render Quarto document to HTML presentation
quarto render presen_test.qmd

# Preview Quarto presentation
quarto preview presen_test.qmd
```

## Dependencies

### R Packages Required
- `ggplot2` - for data visualization
- `dplyr` - for data manipulation
- `scales` - for axis formatting

### System Requirements
- R statistical software
- Quarto (for presentation rendering)
- Japanese font support for proper text rendering in visualizations

## Data Visualization Approach

The project uses a sophisticated ggplot2 approach with:
- Custom orange color palettes for agricultural theming
- Japanese text support across different operating systems
- High-quality PNG export (300 DPI, 12x8 inches)
- Statistical analysis including correlation and regression

## File Naming Conventions

- R scripts use descriptive names with underscores (e.g., `tomato_yeald_light.R`)
- Generated images follow the pattern `{analysis_type}_analysis.png`
- Presentations use `presen_test` prefix

## Language Considerations

This project includes Japanese text content. When working with visualizations:
- Ensure proper Japanese font rendering
- Test across different operating systems (Windows/macOS/Linux)
- Maintain UTF-8 encoding for all text files