import React from 'react';
import { Package, Hammer, Search, CheckCircle, Truck } from 'lucide-react';

const STAGES = [
    { key: 'PLACED', label: 'Order Placed', icon: Package },
    { key: 'MATERIALS', label: 'Materials Sourced', icon: Search },
    { key: 'BUILDING', label: 'In Production', icon: Hammer },
    { key: 'QUALITY', label: 'Quality Check', icon: CheckCircle },
    { key: 'DELIVERED', label: 'Delivered', icon: Truck },
];

function getActiveIndex(status) {
    if (status === 'COMPLETED') return 5;
    if (status === 'IN_PROGRESS') return 2; // Simulated — in real app this would come from the order data
    return 0;
}

export default function OrderTimeline({ status }) {
    const activeIndex = getActiveIndex(status);

    return (
        <div className="order-timeline">
            {STAGES.map((stage, i) => {
                const Icon = stage.icon;
                const isDone = i < activeIndex;
                const isActive = i === activeIndex;
                return (
                    <div key={stage.key} className={`order-timeline-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                        <div className="order-timeline-dot">
                            {isDone ? <CheckCircle size={14} /> : <Icon size={14} />}
                        </div>
                        {i < STAGES.length - 1 && <div className={`order-timeline-line ${isDone ? 'done' : ''}`} />}
                        <span className="order-timeline-label">{stage.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
