import CustomText, { CustomTextProps } from "@/components/elements/CustomText";

const SettingsTitle = ({ className, ...props }: CustomTextProps) => {
  return (
    <CustomText
      //TODO: BUG: md:text-start does not overwrite text-center on iOS
      className={`mt-4 md:mt-0 text-3xl font-semibold opacity-85 mb-3 md:text-start text-center ${className}`}
      {...props}
    />
  );
};

export default SettingsTitle;
