import PropTypes from 'prop-types';

export default function Input({
    label,
    type = 'text',
    customClass = '',
    onChange,
    placeholder = '',
    required = false,
    value,
    errorMessage,
    disabled=false,
    onKeyPress
}){
    return (
        <div className="flex flex-col">
            {label && <label htmlFor="" className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
            <input 
                type={type} 
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                onKeyDown={onKeyPress}
                className={`w-full px-1.5 py-1.5 border rounded-md text-[13px] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${ errorMessage ? 'border-red-500' : 'border-gray-300'} ${customClass && customClass}`}
                />
                {errorMessage && <p className="mt-1 text-xs leading-4 text-red-500">{errorMessage}</p>}
        </div>
    )
}

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    customClass: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    errorMessage: PropTypes.string,
    disabled: PropTypes.bool
};