import styles from "../styles/components/StepCard.module.scss";
import StepCard from "./StepCard";

export default function StepCardList({ steps }) {
    return (
        <div className={styles.stepList}>
            {steps.map((step) => (
                <StepCard key={step.num} icon={step.icon} label={step.label} num={step.num} />
            ))}
        </div>
    );
}