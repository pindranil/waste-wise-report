import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { FormField, FormType } from '../types';

interface DynamicFormProps {
  formType: FormType;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  loading?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formType, onSubmit, loading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                label={field.label}
                value={value || ''}
                onChange={onChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message as string}
                required={field.required}
              />
            )}
          />
        );
        
      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                multiline
                rows={4}
                label={field.label}
                value={value || ''}
                onChange={onChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message as string}
                required={field.required}
              />
            )}
          />
        );
        
      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <TextField
                fullWidth
                select
                label={field.label}
                value={value || ''}
                onChange={onChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message as string}
                required={field.required}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        );
        
      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!!value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                }
                label={field.label}
              />
            )}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {formType.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {formType.description}
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {formType.fields_json.map((field) => (
            <Box key={field.name}>
              {renderField(field)}
            </Box>
          ))}
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Form'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default DynamicForm;
