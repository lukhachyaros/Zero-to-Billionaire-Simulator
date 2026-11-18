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
        public int priority = 50;
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
        public string nextEventId;       // Chuỗi sự kiện nối tiếp
        public string educationSet;      // Cập nhật cấp học nếu có
        public string maritalStatusSet;  // Cập nhật tình trạng hôn nhân nếu có
        public int childrenDelta = 0;    // Số con tăng thêm nếu có
    }

    [System.Serializable]
    public class EventCondition
    {
        public string field;        // "age", "cash", "netWorth", "intelligence", "gender", "hasFlag", "notHasFlag", "childrenCount"
        public string operatorType; // "==", ">=", "<=", ">", "<", "!="
        public string stringValue;
        public long numberValue;
    }
}
