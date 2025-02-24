'use client';

import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Box {
    id: number;
    boxNumber: number;
}

function BoxInput() {
    const [boxNumber, setBoxNumber] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [fetchedBoxes, setFetchedBoxes] = useState<Box[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [selectedExistingBox, setSelectedExistingBox] = useState<string | null>(null);
    const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null); // Add this state
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchBoxes = async () => {
            setFetchLoading(true);
            setFetchError(null);

            try {
                const response = await fetch('/api/boxes');
                if (!response.ok) {
                    throw new Error('Failed to fetch boxes');
                }
                const data = await response.json();
                setFetchedBoxes(data);
            } catch (err) {
                console.error('Error fetching boxes:', err);
                setFetchError('Error fetching boxes.');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchBoxes();
    }, []);

    const handleSaveBox = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const boxToSave = selectedExistingBox !== null ? selectedExistingBox : boxNumber;

        if (!boxToSave) {
            setError('Box number is required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/boxes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ boxNumber: parseInt(boxToSave, 10) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save box.');
                return;
            }

            setSuccessMessage('Box saved successfully!');
            setBoxNumber('');
            setSelectedExistingBox(null);
            setSelectedBoxId(null); // Reset box id
            fetch('/api/boxes')
                .then((res) => res.json())
                .then((data) => {
                    setFetchedBoxes(data);
                });

            if (hiddenInputRef.current) {
                hiddenInputRef.current.value = selectedBoxId || '';
            }

        } catch (err) {
            console.error('Error saving box:', err);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleBoxNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoxNumber(e.target.value);
        setSelectedBoxId(null); // Reset box id
        if (hiddenInputRef.current) {
            hiddenInputRef.current.value = '';
        }
    };

    const handleExistingBoxChange = (value: string) => {
        setSelectedExistingBox(value);
        setBoxNumber('');
        const selectedBox = fetchedBoxes.find((box) => box.boxNumber.toString() === value);
        if (selectedBox) {
            setSelectedBoxId(selectedBox.id.toString());
            if (hiddenInputRef.current) {
                hiddenInputRef.current.value = selectedBox.id.toString();
            }
        }
    };

    return (
        <div className="mb-2">
            <Label htmlFor="boxNumber" className="capitalize">
                Box Number
            </Label>

            <Select onValueChange={handleExistingBoxChange} value={selectedExistingBox}>
                <SelectTrigger>
                    <SelectValue placeholder="Select existing box number" />
                </SelectTrigger>
                <SelectContent>
                    {fetchedBoxes.map((box) => (
                        <SelectItem key={box.id} value={box.boxNumber.toString()}>
                            {box.boxNumber}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                type="number"
                id="boxNumber"
                value={boxNumber}
                onChange={handleBoxNumberChange}
                placeholder="Or enter new box number"
                className="mt-2"
            />

            <Button className="mt-2" onClick={handleSaveBox} disabled={loading}>
                {loading ? 'Saving...' : 'Save Box'}
            </Button>

            <input type="hidden" name="boxId" ref={hiddenInputRef} value={selectedBoxId || ''} />

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

            {fetchLoading && <p>Loading existing box numbers...</p>}
            {fetchError && <p className="text-red-500 mt-2">{fetchError}</p>}
        </div>
    );
}

export default BoxInput;