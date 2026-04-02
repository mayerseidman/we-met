# We Met — Database Schema

## users
Stores user profile information. One row per user.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, auto-generated |
| created_at | timestamptz | Auto-set on insert |
| name | text | Display name |
| instagram | text | Instagram handle |
| phone | text | Phone number (text to support + and formatting) |
| photo_url | text | URL to photo in Supabase Storage (not base64) |
| about | text | Bio/description |
| location | text | Where they're from |

## RLS Policies
- SELECT: authenticated users can only read their own row
- INSERT: authenticated users can only insert their own row
- UPDATE: authenticated users can only update their own row

## Notes
- photo_url stores a URL string, not base64 image data
- whatsapp was considered but removed — phone field is used instead
- connections table to be designed later