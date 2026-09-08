"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get classifyAgentChatTurnOutcome () {
        return classifyAgentChatTurnOutcome;
    },
    get resolveSupersededTurnOutcome () {
        return resolveSupersededTurnOutcome;
    }
});
const classifyAgentChatTurnOutcome = ({ hasText, isAborted, isAwaitingUserAnswer, outOfCredits })=>{
    // Asking the user a question is how a turn is meant to end when the request is
    // ambiguous, and stopWhen ends the stream on it — so it is a completed turn
    // waiting on an answer, not an abandoned one.
    if (isAwaitingUserAnswer) {
        return {
            kind: 'completed',
            outcome: 'awaiting_user'
        };
    }
    if (isAborted) {
        return {
            kind: 'cancelled',
            reason: 'user_cancelled'
        };
    }
    if (hasText) {
        return {
            kind: 'completed',
            outcome: 'answered'
        };
    }
    return {
        kind: 'failed',
        failurePhase: outOfCredits ? 'credits_exhausted' : 'no_text'
    };
};
const resolveSupersededTurnOutcome = (outcome)=>outcome.kind === 'failed' ? outcome : {
        kind: 'cancelled',
        reason: 'superseded'
    };

//# sourceMappingURL=classify-agent-chat-turn-outcome.util.js.map