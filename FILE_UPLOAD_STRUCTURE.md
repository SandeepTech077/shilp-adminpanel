# File Upload Structure

## Project File Organization

Starting from this update, all project files are now organized into project-specific folders based on the project title.

### Folder Structure

```
uploads/
└── projects/
    ├── luxury-residential-project-mumbai/
    │   ├── brochure_1731234567890_abc123.pdf
    │   ├── about_1731234567891_def456.jpg
    │   ├── card_1731234567892_ghi789.jpg
    │   ├── floorplan_1_1731234567893_jkl012.jpg
    │   ├── floorplan_2_1731234567894_mno345.jpg
    │   ├── project_1_1731234567895_pqr678.jpg
    │   ├── project_2_1731234567896_stu901.jpg
    │   ├── amenity_1_1731234567897_vwx234.svg
    │   ├── amenity_2_1731234567898_yza567.jpg
    │   ├── updated_1_1731234567899_bcd890.jpg
    │   └── updated_2_1731234567900_efg123.jpg
    └── commercial-complex-1-phase-2/
        ├── brochure_1731234567901_hij456.pdf
        ├── about_1731234567902_klm789.jpg
        └── ...
```

### Folder Naming Convention

Project titles are converted to safe directory names using the following rules:

1. Convert to lowercase
2. Remove special characters (keep only letters, numbers, spaces, and hyphens)
3. Replace spaces with hyphens
4. Replace multiple consecutive hyphens with single hyphens
5. Remove leading/trailing hyphens
6. Limit to 50 characters maximum
7. Fallback to "untitled" if the result is empty

### Examples

| Project Title | Folder Name |
|--------------|-------------|
| "Luxury Residential Project @ Mumbai" | `luxury-residential-project-mumbai` |
| "Commercial Complex #1 - Phase 2" | `commercial-complex-1-phase-2` |
| "Project with    multiple   spaces" | `project-with-multiple-spaces` |
| "शिल्प प्रोजेक्ट" (non-English) | `untitled` |
| "" (empty) | `untitled` |

### File Naming Convention

Within each project folder, files are named using the pattern:
```
{prefix}_{timestamp}_{random}.{extension}
```

Where:
- `prefix`: Describes the file type (brochure, about, card, floorplan_1, project_1, amenity_1, updated_1, etc.)
- `timestamp`: Unix timestamp when the file was uploaded
- `random`: 6-character random string for uniqueness
- `extension`: Original file extension

### Benefits

1. **Organization**: All files for a project are grouped together
2. **Easy Management**: Simple to find, backup, or delete project files
3. **Scalability**: Prevents the main uploads folder from becoming cluttered
4. **Uniqueness**: Timestamp + random string ensures unique file names
5. **Security**: Safe directory names prevent path traversal attacks