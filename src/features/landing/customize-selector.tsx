import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { GaugeCircle, Settings, Volume2, Waves } from 'lucide-react';
import { useState } from 'react';

interface SliderControlProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onChange: (value: number[]) => void;
}

const SliderControl = ({ label, value, icon, color, onChange }: SliderControlProps) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={cn('rounded p-1.5', color)}>{icon}</div>
                <label className="text-sm font-medium text-white/80">{label}</label>
            </div>
            <span className="text-xs font-medium text-white/70">{value}%</span>
        </div>

        <Slider
            defaultValue={[value]}
            max={100}
            step={1}
            className={cn(
                '[&>[role=slider]]: py-1 [&>[role=slider]]:border-2 [&>[role=slider]]:border-white' +
                    color.replace('bg-', 'border-'),
                '[&>[role=slider]_[data-orientation=horizontal]]:bg-' + color.split('-')[1],
            )}
            onValueChange={onChange}
        />
    </div>
);

export const CustomizerView = () => {
    const [beatIntensity, setBeatIntensity] = useState(65);
    const [ambientVolume, setAmbientVolume] = useState(40);
    const [visualOpacity, setVisualOpacity] = useState(80);
    const [selectedDuration, setSelectedDuration] = useState(45);

    const durations = [
        { value: 25, label: '25m' },
        { value: 45, label: '45m' },
        { value: 60, label: '60m' },
        { value: 0, label: '∞' },
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-lg">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-medium text-white/90">Fine-Tune Your Experience</h3>
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></div>
            </div>

            <div className="mb-6 space-y-6">
                <SliderControl
                    label="Beat Intensity"
                    value={beatIntensity}
                    icon={<Volume2 size={16} className="text-white" />}
                    color="bg-indigo-600"
                    onChange={(values) => setBeatIntensity(values[0] ?? beatIntensity)}
                />

                <SliderControl
                    label="Ambient Sounds"
                    value={ambientVolume}
                    icon={<Waves size={16} className="text-white" />}
                    color="bg-amber-500"
                    onChange={(values) => setAmbientVolume(values[0] ?? ambientVolume)}
                />

                <SliderControl
                    label="Visual Opacity"
                    value={visualOpacity}
                    icon={<GaugeCircle size={16} className="text-white" />}
                    color="bg-emerald-500"
                    onChange={(values) => setVisualOpacity(values[0] ?? visualOpacity)}
                />

                <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-white/80">Session Duration</label>
                        <span className="text-xs font-medium text-white/70">
                            {selectedDuration === 0 ? 'Continuous' : `${selectedDuration} minutes`}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {durations.map((duration) => (
                            <Button
                                key={duration.value}
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'flex-1 border-white/10 transition-all',
                                    selectedDuration === duration.value
                                        ? 'bg-white/15 text-white'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10',
                                )}
                                onClick={() => setSelectedDuration(duration.value)}
                            >
                                {duration.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white transition-transform hover:scale-[1.02]">
                    Apply Changes
                </Button>
                <Button variant="outline" className="border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
                    <Settings size={15} className="mr-2 opacity-80" />
                    Advanced
                </Button>
            </div>
        </div>
    );
};
