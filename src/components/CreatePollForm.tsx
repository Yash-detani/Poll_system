"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Loader2 } from 'lucide-react';

export function CreatePollForm() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const filteredOptions = options.map(o => o.trim()).filter(o => o.length > 0);

    if (question.trim().length === 0) {
      toast({ title: 'Error', description: 'Please enter a poll question.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    if (filteredOptions.length < 2) {
      toast({ title: 'Error', description: 'Please provide at least two non-empty options.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/polls/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options: filteredOptions }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create poll');
      }

      router.push(`/poll/${data.pollId}`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Something went wrong. Please try again.', variant: 'destructive' });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question" className="text-lg font-medium">Poll Question</Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What's your favorite programming language?"
          required
          className="py-6 text-base"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Options</Label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            {options.length > 2 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addOption} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Option
        </Button>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Poll...
          </>
        ) : (
          'Create Poll'
        )}
      </Button>
    </form>
  );
}
