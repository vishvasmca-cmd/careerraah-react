
'use server';

import { onboardingAnswer } from '@/ai/flows/onboarding-answer';
import type { OnboardingAnswerInput } from '@/ai/schemas/onboarding-answer';
// import { db } from '@/lib/firebase-admin';
// import * as crypto from 'crypto';

export async function getOnboardingAnswerAction(data: OnboardingAnswerInput) {
    try {
        // TODO: Re-enable caching once Firebase Admin credentials are configured
        // Caching temporarily disabled to avoid server errors

        // Call AI directly without caching
        console.log(`🤖 Calling AI for: ${data.userQuestion}`);
        const result = await onboardingAnswer(data);
        return { data: result };

        /* CACHING CODE - DISABLED
        // 1. Generate a consistent hash for the question key
        const normalizedKey = `${data.userQuestion.toLowerCase().trim()}|${data.grade.toLowerCase().trim()}|${data.location.toLowerCase().trim()}`;
        const questionHash = crypto.createHash('md5').update(normalizedKey).digest('hex');

        // 2. Check Cache
        const cacheRef = db.collection('cached_answers').doc(questionHash);
        const doc = await cacheRef.get();

        if (doc.exists) {
            console.log(`🔥 Cache HIT for: ${data.userQuestion}`);
            const cachedData = doc.data();
            return {
                data: {
                    answer: cachedData?.answer,
                    followUpQuestions: cachedData?.followUpQuestions || []
                }
            };
        }

        // 3. Cache Miss - Call AI
        console.log(`🤖 Cache MISS for: ${data.userQuestion} - Calling AI...`);
        const result = await onboardingAnswer(data);

        // 4. Save to Cache (Fire & Forget promise to not block UI)
        cacheRef.set({
            id: questionHash,
            question: data.userQuestion,
            questionHash: questionHash,
            grade: data.grade,
            location: data.location,
            answer: result.answer,
            followUpQuestions: result.followUpQuestions,
            createdAt: new Date()
        }).catch(err => console.error("Cache Write Error:", err));

        return { data: result };
        */

    } catch (error) {
        console.error("Onboarding AI Error:", error);
        return { error: "Sorry, I'm having trouble thinking right now. Please try again." };
    }
}
