import { FormField } from "@/types/form.types";
import { required } from "@vuelidate/validators"

interface InternalFormField extends FormField {
    _stepIndex?: number
}

export const MapArrayToObject = (array: any[]) => {
    let obj: any = {}
    for(const { key, value } of array) obj[key] = value
    return obj
}

export const MapFormInitialState = (fields: any[], inputFormData: any) => {
    let state: any = {}
    fields.forEach((field: any) => {
        if(!['array', 'object'].includes(field.type)) state[field.key] = inputFormData[field.key] ?? null
        if(field.type === 'object') state[field.key] = MapFormInitialState(field.children, inputFormData[field.key] ?? {})
    })
    return state
}

export const MapFormRules = (fields: any[]) => {
    let rules: any = {}    
    fields.forEach((field: any) => {
        if(!['array', 'object'].includes(field.type)) rules[field.key] = field.validators ? { ...field.validators } : { required }
        if(field.type === 'object') rules[field.key] = MapFormRules(field.children)
    })
    return rules   
}

export const MapStepsAsFields = (steps: any[]) => steps.map((step, _stepIndex) =>  step.fields.map((field: any) => ({ ...field, _stepIndex}))).flat()

export const MapDependenciesAsObject = (arrayDependencies: any) => {
    let dependencies: any = {};
    for (const { key, value } of arrayDependencies) dependencies[key] = value;
    return dependencies;
}

export const ResolveFromString = (path: string, obj: any, separator = '.') => {
    var properties: string[] = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export const FilterFieldActiveRules = (fields: InternalFormField[], activeStep: number) => fields.filter(field => field._stepIndex === activeStep)