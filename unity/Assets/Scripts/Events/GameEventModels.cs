using System;
using System.Collections.Generic;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Events
{
    [System.Serializable]
    public class GameEvent
    {
        public string eventId;
        public string category; // "childhood", "education", "career", "relationship", "finance", "culture"
        public string title;
        public string description;
        public int minAge;
        public int maxAge;
        public int priority;
        public bool isOneTime = true;
        public List<EventCondition> conditions = new List<EventCondition>();
        public List<EventOption> options = new List<EventOption>();
    }

    [System.Serializable]
    public class EventOption
    {
        public string id;
        public string label;
        public string requirementText;
        public List<EventOutcome> outcomes = new List<EventOutcome>();
    }

    [System.Serializable]
    public class EventOutcome
    {
        public float probability = 1.0f;
        public string conditionFormula; // e.g. "intelligence >= 60"
        public string message;
        public StatModifiers statModifiers = new StatModifiers();
        public List<string> unlockedFlags = new List<string>();
        public string nextEventId; // Event chaining
    }

    [System.Serializable]
    public class EventCondition
    {
        public string field; // "age", "cash", "intelligence", "gender", "hasFlag"
        public string operatorType; // "==", ">=", "<=", ">", "<", "!="
        public string stringValue;
        public long numberValue;
    }
}
