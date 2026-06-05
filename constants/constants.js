// Validation functions
export const isValidPhone = (phone) => {
    if (!phone) return false;
    // Reject if contains letters
    if (/[a-zA-Z]/.test(phone)) return false;
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has 10-11 digits
    return digitsOnly.length >= 10 && digitsOnly.length <= 11;
};

// Form field definitions
export const FORM_FIELDS = [
    {
        name: 'name',
        label: 'NAME',
        type: 'text',
        placeholder: 'What can we call you?',
        required: true,
        errorMessage: 'Name required :)',
    },
    {
        name: 'phone',
        label: 'PHONE',
        type: 'tel',
        placeholder: 'What are your digits?',
        required: true,
        errorMessage: 'Phone required :)',
        invalidMessage: 'Must be valid number: +1 (123) 123-1234',
    },
    {
        name: 'instagram',
        label: 'INSTAGRAM',
        type: 'text',
        placeholder: "What's your handle?",
        required: false,
    },
    {
        name: 'location',
        label: 'LOCATION',
        type: 'text',
        placeholder: 'Where do you live?',
        required: false,
    },
    {
        name: 'about',
        label: 'ABOUT',
        type: 'textarea',
        placeholder: "Write something so people can remember you like your favorite color or your cat's name or whatever :)",
        required: false,
    },
];

export const SAMPLE_DATA = {
    name: "Big Maestro",
    phone: "+1 114-432-3087",
    instagram: "bigmaestrotimo99",
    location: "Columbus, Ohio",
    about: "Write something so people can remember you like your favorite color or your cat's name or whatever :)",
    photo: null,
};

export const PLACEHOLDER_HEADSHOT = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop";

export const EMPTY_PROFILE = {
    name: "",
    phone: "",
    instagram: "",
    location: "",
    about: "",
    photo: null,
};

export const DEV_MODE_OPTIONS = [
    { key: 'newUser',   label: 'New User' },
    { key: 'hasInfo',   label: 'Has Info' },
    { key: 'hasPhoto',  label: 'Has Photo' },
    { key: 'isEditing', label: 'Editing' },
    { key: 'showErrors',label: 'Show Errors' },
    { key: 'isSaving',  label: 'Saving State' },
    { key: 'isSaved',   label: 'Saved State' },
];