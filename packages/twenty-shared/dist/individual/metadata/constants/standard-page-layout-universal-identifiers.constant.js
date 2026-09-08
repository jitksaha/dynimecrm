import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS as e } from "./standard-object-universal-identifiers.constant.js";
import { buildStandardObjectRecordPageLayout as i } from "../utils/internal/build-standard-object-record-page-layout.util.js";
var l = {
  myFirstDashboard: {
    universalIdentifier: "20202020-d001-4d01-8d01-da5ab0a00001",
    tabs: { tab1: {
      universalIdentifier: "20202020-d011-4d11-8d11-da5ab0a01001",
      widgets: {
        welcomeRichText: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11001" },
        dealsByCompany: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11002" },
        pipelineValueByStage: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11003" },
        revenueTimeline: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11004" },
        opportunitiesByOwner: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11005" },
        stockMarketIframe: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11006" },
        dealsCreatedThisMonth: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11007" },
        dealValueCreatedThisMonth: { universalIdentifier: "20202020-d111-4d11-8d11-da5ab0a11008" }
      }
    } }
  },
  companyRecordPage: i({
    objectUniversalIdentifier: e.company,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          people: "People",
          opportunities: "Opportunities"
        }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      },
      tasks: {
        title: "Tasks",
        widgets: { tasks: "Tasks" }
      },
      notes: {
        title: "Notes",
        widgets: { notes: "Notes" }
      },
      files: {
        title: "Files",
        widgets: { files: "Files" }
      },
      emails: {
        title: "Emails",
        widgets: { emails: "Emails" }
      },
      calendar: {
        title: "Calendar",
        widgets: { calendar: "Calendar" }
      }
    }
  }),
  personRecordPage: i({
    objectUniversalIdentifier: e.person,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          company: "Company",
          pointOfContactForOpportunities: "Opportunities",
          listMemberships: "Lists"
        }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      },
      tasks: {
        title: "Tasks",
        widgets: { tasks: "Tasks" }
      },
      notes: {
        title: "Notes",
        widgets: { notes: "Notes" }
      },
      files: {
        title: "Files",
        widgets: { files: "Files" }
      },
      emails: {
        title: "Emails",
        widgets: { emails: "Emails" }
      },
      calendar: {
        title: "Calendar",
        widgets: { calendar: "Calendar" }
      }
    }
  }),
  opportunityRecordPage: i({
    objectUniversalIdentifier: e.opportunity,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          pointOfContact: "Point of Contact",
          company: "Company",
          owner: "Owner"
        }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      },
      tasks: {
        title: "Tasks",
        widgets: { tasks: "Tasks" }
      },
      notes: {
        title: "Notes",
        widgets: { notes: "Notes" }
      },
      files: {
        title: "Files",
        widgets: { files: "Files" }
      },
      emails: {
        title: "Emails",
        widgets: { emails: "Emails" }
      },
      calendar: {
        title: "Calendar",
        widgets: { calendar: "Calendar" }
      }
    }
  }),
  noteRecordPage: i({
    objectUniversalIdentifier: e.note,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          noteRichText: "Note"
        }
      },
      note: {
        title: "Note",
        widgets: { noteRichText: "Note" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      },
      files: {
        title: "Files",
        widgets: { files: "Files" }
      }
    }
  }),
  taskRecordPage: i({
    objectUniversalIdentifier: e.task,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          taskRichText: "Task"
        }
      },
      note: {
        title: "Note",
        widgets: { taskRichText: "Task" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      },
      files: {
        title: "Files",
        widgets: { files: "Files" }
      }
    }
  }),
  workflowRecordPage: i({
    objectUniversalIdentifier: e.workflow,
    tabs: { flow: {
      title: "Flow",
      widgets: { workflow: "Flow" }
    } }
  }),
  workflowVersionRecordPage: i({
    objectUniversalIdentifier: e.workflowVersion,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          workflow: "Workflow"
        }
      },
      flow: {
        title: "Flow",
        widgets: { workflowVersion: "Flow" }
      }
    }
  }),
  workflowRunRecordPage: i({
    objectUniversalIdentifier: e.workflowRun,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          workflow: "Workflow"
        }
      },
      flow: {
        title: "Flow",
        widgets: { workflowRun: "Flow" }
      }
    }
  }),
  blocklistRecordPage: i({
    objectUniversalIdentifier: e.blocklist,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      }
    }
  }),
  calendarChannelEventAssociationRecordPage: i({
    objectUniversalIdentifier: e.calendarChannelEventAssociation,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      }
    }
  }),
  calendarEventRecordPage: i({
    objectUniversalIdentifier: e.calendarEvent,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          fields: "Fields",
          participants: "Participants",
          callRecordings: "Call Recordings"
        }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      },
      summary: {
        title: "Summary",
        widgets: { summary: "Summary" }
      },
      callRecording: {
        title: "Call Recording",
        widgets: { transcript: "Transcript" }
      }
    }
  }),
  calendarEventParticipantRecordPage: i({
    objectUniversalIdentifier: e.calendarEventParticipant,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      }
    }
  }),
  callRecordingRecordPage: i({
    objectUniversalIdentifier: e.callRecording,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      },
      summary: {
        title: "Summary",
        widgets: { summary: "Summary" }
      },
      callRecording: {
        title: "Call Recording",
        widgets: { transcript: "Transcript" }
      }
    }
  }),
  messageChannelMessageAssociationRecordPage: i({
    objectUniversalIdentifier: e.messageChannelMessageAssociation,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      }
    }
  }),
  messageChannelMessageAssociationMessageFolderRecordPage: i({
    objectUniversalIdentifier: e.messageChannelMessageAssociationMessageFolder,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      }
    }
  }),
  messageParticipantRecordPage: i({
    objectUniversalIdentifier: e.messageParticipant,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      }
    }
  }),
  workflowAutomatedTriggerRecordPage: i({
    objectUniversalIdentifier: e.workflowAutomatedTrigger,
    tabs: {
      home: {
        title: "Home",
        widgets: { fields: "Fields" }
      },
      timeline: {
        title: "Timeline",
        widgets: { timeline: "Timeline" }
      }
    }
  }),
  messageThreadRecordPage: i({
    objectUniversalIdentifier: e.messageThread,
    tabs: { home: {
      title: "Home",
      widgets: { emailThread: "Thread" }
    } }
  }),
  messageListRecordPage: i({
    objectUniversalIdentifier: e.messageList,
    tabs: { home: {
      title: "Home",
      widgets: {
        fields: "Fields",
        members: "Members"
      }
    } }
  }),
  messageCampaignRecordPage: i({
    objectUniversalIdentifier: e.messageCampaign,
    tabs: {
      home: {
        title: "Home",
        widgets: {
          details: "Details",
          list: "List",
          recipients: "Recipients",
          fields: "Fields"
        }
      },
      composer: {
        title: "Email",
        widgets: { messageCampaign: "Email" }
      }
    }
  })
};
export {
  l as STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
};

//# sourceMappingURL=standard-page-layout-universal-identifiers.constant.js.map