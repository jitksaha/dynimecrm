export declare const STANDARD_OBJECTS: {
    readonly attachment: {
        readonly universalIdentifier: "20202020-bd3d-4c60-8dca-571c71d4447a";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            file: {
                universalIdentifier: string;
            };
            fullPath: {
                universalIdentifier: string;
            };
            fileCategory: {
                universalIdentifier: string;
            };
            targetTask: {
                universalIdentifier: string;
            };
            targetNote: {
                universalIdentifier: string;
            };
            targetPerson: {
                universalIdentifier: string;
            };
            targetCompany: {
                universalIdentifier: string;
            };
            targetOpportunity: {
                universalIdentifier: string;
            };
            targetDashboard: {
                universalIdentifier: string;
            };
            targetWorkflow: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly morphIds: {
            readonly targetMorphId: {
                readonly morphId: "20202020-f634-435d-ab8d-e1168b375c69";
            };
        };
        readonly indexes: {
            readonly taskIdIndex: {
                readonly universalIdentifier: "b8d4f9a3-0c25-4e7b-9f6a-2d3e4c5b6f70";
            };
            readonly noteIdIndex: {
                readonly universalIdentifier: "9d31ea73-13b6-4e06-84ee-c66c72bf7787";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "55637a5a-1edc-4351-8d76-d40020bf8944";
            };
            readonly companyIdIndex: {
                readonly universalIdentifier: "4137ba06-184d-438f-b484-080f02a97659";
            };
            readonly opportunityIdIndex: {
                readonly universalIdentifier: "8cc162d1-c127-4981-878d-f78622f8f12d";
            };
            readonly dashboardIdIndex: {
                readonly universalIdentifier: "c10eba2d-ff1a-4eab-9285-50481c12a003";
            };
            readonly workflowIdIndex: {
                readonly universalIdentifier: "fadeab4b-79ee-4173-af79-72c51fbad888";
            };
        };
        readonly views: {
            readonly allAttachments: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "file" | "name" | "targetCompany" | "targetDashboard" | "targetNote" | "targetOpportunity" | "targetPerson" | "targetTask" | "targetWorkflow", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly blocklist: {
        readonly universalIdentifier: "20202020-0408-4f38-b8a8-4d5e3e26e24d";
        readonly fields: {
            handle: {
                universalIdentifier: string;
            };
            scope: {
                universalIdentifier: string;
            };
            workspaceMember: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly workspaceMemberIdIndex: {
                readonly universalIdentifier: "4daf320e-74d0-4f24-a45a-af3a09d741cb";
            };
        };
        readonly views: {
            readonly allBlocklists: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "handle" | "workspaceMember", {
                    universalIdentifier: string;
                }>;
            };
            readonly blocklistRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "workspaceMember", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly calendarChannelEventAssociation: {
        readonly universalIdentifier: "20202020-491b-4aaa-9825-afd1bae6ae00";
        readonly fields: {
            calendarChannelId: {
                universalIdentifier: string;
            };
            calendarEvent: {
                universalIdentifier: string;
            };
            eventExternalId: {
                universalIdentifier: string;
            };
            recurringEventExternalId: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly calendarChannelIdIndex: {
                readonly universalIdentifier: "ff6b86c1-3112-4dfa-b734-c4789111a716";
            };
            readonly calendarEventIdIndex: {
                readonly universalIdentifier: "47a3c8d2-9f14-4b6e-8c5d-1a2b3f4e5c69";
            };
        };
        readonly views: {
            readonly allCalendarChannelEventAssociations: {
                universalIdentifier: string;
                viewFields: Record<"calendarChannelId" | "calendarEvent" | "createdAt" | "eventExternalId", {
                    universalIdentifier: string;
                }>;
            };
            readonly calendarChannelEventAssociationRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"calendarChannelId" | "calendarEvent" | "createdAt" | "createdBy" | "eventExternalId", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly calendarEventParticipant: {
        readonly universalIdentifier: "20202020-a1c3-47a6-9732-27e5b1e8436d";
        readonly fields: {
            calendarEvent: {
                universalIdentifier: string;
            };
            handle: {
                universalIdentifier: string;
            };
            displayName: {
                universalIdentifier: string;
            };
            isOrganizer: {
                universalIdentifier: string;
            };
            responseStatus: {
                universalIdentifier: string;
            };
            person: {
                universalIdentifier: string;
            };
            workspaceMember: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly calendarEventIdIndex: {
                readonly universalIdentifier: "c458ad97-8b95-43de-9003-88eb68576049";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "30e9b75a-881f-4a85-aaf1-f2d2464be1cf";
            };
            readonly workspaceMemberIdIndex: {
                readonly universalIdentifier: "898aa202-428f-4a7a-a3b3-8f0a17a6658e";
            };
        };
        readonly views: {
            readonly allCalendarEventParticipants: {
                universalIdentifier: string;
                viewFields: Record<"calendarEvent" | "createdAt" | "displayName" | "handle" | "isOrganizer" | "person" | "responseStatus" | "workspaceMember", {
                    universalIdentifier: string;
                }>;
            };
            readonly calendarEventParticipantRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"calendarEvent" | "createdAt" | "createdBy" | "displayName" | "handle" | "isOrganizer" | "person" | "responseStatus" | "workspaceMember", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly calendarEvent: {
        readonly universalIdentifier: "20202020-8f1d-4eef-9f85-0d1965e27221";
        readonly fields: {
            title: {
                universalIdentifier: string;
            };
            isCanceled: {
                universalIdentifier: string;
            };
            isFullDay: {
                universalIdentifier: string;
            };
            startsAt: {
                universalIdentifier: string;
            };
            endsAt: {
                universalIdentifier: string;
            };
            externalCreatedAt: {
                universalIdentifier: string;
            };
            externalUpdatedAt: {
                universalIdentifier: string;
            };
            description: {
                universalIdentifier: string;
            };
            location: {
                universalIdentifier: string;
            };
            iCalUid: {
                universalIdentifier: string;
            };
            conferenceSolution: {
                universalIdentifier: string;
            };
            conferenceLink: {
                universalIdentifier: string;
            };
            calendarChannelEventAssociations: {
                universalIdentifier: string;
            };
            calendarEventParticipants: {
                universalIdentifier: string;
            };
            calendarEventTargets: {
                universalIdentifier: string;
            };
            callRecordings: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {};
        readonly views: {
            readonly allCalendarEvents: {
                universalIdentifier: string;
                viewFields: Record<"conferenceLink" | "createdAt" | "endsAt" | "isCanceled" | "isFullDay" | "location" | "startsAt" | "title", {
                    universalIdentifier: string;
                }>;
            };
            readonly calendarEventRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"calendarEventTargets" | "conferenceLink" | "conferenceSolution" | "description" | "endsAt" | "externalCreatedAt" | "externalUpdatedAt" | "iCalUid" | "isCanceled" | "isFullDay" | "location" | "startsAt" | "title", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly calendarEventTarget: {
        readonly universalIdentifier: "6a9b9656-3e23-4234-94a4-b913c5dde668";
        readonly fields: {
            calendarEvent: {
                universalIdentifier: string;
            };
            isAutomaticallyAssigned: {
                universalIdentifier: string;
            };
            isManuallyAssigned: {
                universalIdentifier: string;
            };
            targetPerson: {
                universalIdentifier: string;
            };
            targetCompany: {
                universalIdentifier: string;
            };
            targetOpportunity: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly morphIds: {
            readonly targetMorphId: {
                readonly morphId: "676e9f68-7b5c-41e6-b46d-2fb9527b7051";
            };
        };
        readonly indexes: {
            readonly calendarEventIdIndex: {
                readonly universalIdentifier: "ce1c180c-0236-4673-ad1d-359dddf59f93";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "f151bc84-ba45-40cb-b064-02ef359ac17b";
            };
            readonly companyIdIndex: {
                readonly universalIdentifier: "30413277-505d-4f08-be38-a56257460f9f";
            };
            readonly opportunityIdIndex: {
                readonly universalIdentifier: "7920092d-281f-473a-8ea4-53c209b36a37";
            };
            readonly calendarEventPersonUniqueIndex: {
                readonly universalIdentifier: "15b9e394-d451-4186-aaf0-612f6be1ea91";
            };
            readonly calendarEventCompanyUniqueIndex: {
                readonly universalIdentifier: "3fa22398-6e7d-47a5-95eb-4971f9d62135";
            };
            readonly calendarEventOpportunityUniqueIndex: {
                readonly universalIdentifier: "c8183b17-5dfe-4e02-8d9d-aef8e54ef07d";
            };
        };
        readonly views: {};
    };
    readonly callRecording: {
        readonly universalIdentifier: "ce19efb9-710f-45b2-b141-473abbeea60b";
        readonly fields: {
            title: {
                universalIdentifier: string;
            };
            status: {
                universalIdentifier: string;
            };
            recordingRequestStatus: {
                universalIdentifier: string;
            };
            applicationId: {
                universalIdentifier: string;
            };
            externalBotId: {
                universalIdentifier: string;
            };
            externalRecordingId: {
                universalIdentifier: string;
            };
            startedAt: {
                universalIdentifier: string;
            };
            endedAt: {
                universalIdentifier: string;
            };
            video: {
                universalIdentifier: string;
            };
            audio: {
                universalIdentifier: string;
            };
            transcript: {
                universalIdentifier: string;
            };
            summary: {
                universalIdentifier: string;
            };
            calendarEvent: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly calendarEventIdIndex: {
                readonly universalIdentifier: "8be3cc47-9352-4a1b-ad19-bb186bc0865d";
            };
        };
        readonly views: {
            readonly allCallRecordings: {
                universalIdentifier: string;
                viewFields: Record<"recordingRequestStatus" | "startedAt" | "status" | "title", {
                    universalIdentifier: string;
                }>;
            };
            readonly callRecordingRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"audio" | "endedAt" | "recordingRequestStatus" | "startedAt" | "status" | "summary" | "title" | "transcript" | "video", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly company: {
        readonly universalIdentifier: "20202020-b374-4779-a561-80086cb2e17f";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            domainName: {
                universalIdentifier: string;
            };
            address: {
                universalIdentifier: string;
            };
            linkedinLink: {
                universalIdentifier: string;
            };
            annualRevenue: {
                universalIdentifier: string;
            };
            people: {
                universalIdentifier: string;
            };
            accountOwner: {
                universalIdentifier: string;
            };
            taskTargets: {
                universalIdentifier: string;
            };
            noteTargets: {
                universalIdentifier: string;
            };
            calendarEventTargets: {
                universalIdentifier: string;
            };
            messageThreadTargets: {
                universalIdentifier: string;
            };
            opportunities: {
                universalIdentifier: string;
            };
            attachments: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly accountOwnerIdIndex: {
                readonly universalIdentifier: "ec2ebfc9-0c9b-4597-a87d-aa295e2d8bfe";
            };
            readonly domainNameUniqueIndex: {
                readonly universalIdentifier: "dd300c61-f422-467a-91f4-de4f83c4175b";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "c3eb62df-2cc1-4cc3-b7aa-e96a4d65c633";
            };
        };
        readonly views: {
            readonly allCompanies: {
                universalIdentifier: string;
                viewFields: Record<"accountOwner" | "address" | "createdAt" | "createdBy" | "domainName" | "linkedinLink" | "name", {
                    universalIdentifier: string;
                }>;
            };
            readonly companyRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"accountOwner" | "address" | "annualRevenue" | "attachments" | "createdAt" | "createdBy" | "domainName" | "linkedinLink" | "noteTargets" | "opportunities" | "people" | "taskTargets" | "timelineActivities" | "updatedAt" | "updatedBy", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"business" | "contact" | "general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly dashboard: {
        readonly universalIdentifier: "20202020-3840-4b6d-9425-0c5188b05ca8";
        readonly fields: {
            title: {
                universalIdentifier: string;
            };
            pageLayoutId: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            attachments: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "e69f71aa-de0f-4b70-845f-7a8369c47928";
            };
        };
        readonly views: {
            readonly allDashboards: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "title" | "updatedAt", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly messageCampaign: {
        readonly universalIdentifier: "238acb94-dd4c-4036-bc55-19b99d821efd";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            subject: {
                universalIdentifier: string;
            };
            bodyTemplate: {
                universalIdentifier: string;
            };
            fromAddress: {
                universalIdentifier: string;
            };
            status: {
                universalIdentifier: string;
            };
            sentAt: {
                universalIdentifier: string;
            };
            sentCount: {
                universalIdentifier: string;
            };
            deliveredCount: {
                universalIdentifier: string;
            };
            failedCount: {
                universalIdentifier: string;
            };
            bouncedCount: {
                universalIdentifier: string;
            };
            complainedCount: {
                universalIdentifier: string;
            };
            skippedCount: {
                universalIdentifier: string;
            };
            unsubscribeTopicId: {
                universalIdentifier: string;
            };
            list: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            messages: {
                universalIdentifier: string;
            };
            recipients: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly unsubscribeTopicIdIndex: {
                readonly universalIdentifier: "efe8c20e-d12b-4475-969e-e86e0bbfe444";
            };
            readonly listIdIndex: {
                readonly universalIdentifier: "17bffd6a-714a-458d-a547-f9e2183d9520";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "975823ad-9b97-4f39-b2c7-fbd7d77f4bd1";
            };
        };
        readonly views: {
            readonly allMessageCampaigns: {
                universalIdentifier: string;
                viewFields: Record<"bouncedCount" | "complainedCount" | "createdAt" | "deliveredCount" | "failedCount" | "fromAddress" | "list" | "name" | "recipients" | "sentAt" | "sentCount" | "skippedCount" | "status" | "subject", {
                    universalIdentifier: string;
                }>;
            };
            readonly messageCampaignRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"bouncedCount" | "complainedCount" | "deliveredCount" | "failedCount" | "sentAt" | "sentCount" | "skippedCount" | "status", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"stats", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly messageList: {
        readonly universalIdentifier: "826561ea-4816-411c-baa0-eec5e6ca8866";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            members: {
                universalIdentifier: string;
            };
            campaigns: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "8e205171-ed74-4620-b7d2-674aab85033a";
            };
        };
        readonly views: {
            readonly allMessageLists: {
                universalIdentifier: string;
                viewFields: Record<"campaigns" | "createdAt" | "members" | "name", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly messageListMember: {
        readonly universalIdentifier: "27773d24-8ce3-40f8-aa6c-1f590f2c08d2";
        readonly fields: {
            person: {
                universalIdentifier: string;
            };
            list: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly listIdIndex: {
                readonly universalIdentifier: "61188470-6dcb-4b2a-b1a9-baeb688bccae";
            };
            readonly personListUniqueIndex: {
                readonly universalIdentifier: "e5497dc2-1d72-418c-a389-a0645ca0195a";
            };
        };
    };
    readonly messageChannelMessageAssociation: {
        readonly universalIdentifier: "20202020-ad1e-4127-bccb-d83ae04d2ccb";
        readonly fields: {
            messageChannelId: {
                universalIdentifier: string;
            };
            message: {
                universalIdentifier: string;
            };
            messageExternalId: {
                universalIdentifier: string;
            };
            messageThread: {
                universalIdentifier: string;
            };
            messageThreadExternalId: {
                universalIdentifier: string;
            };
            direction: {
                universalIdentifier: string;
            };
            messageFolders: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly messageChannelIdIndex: {
                readonly universalIdentifier: "9894f9a3-0225-4e7b-9f6a-23d4e2576784";
            };
            readonly messageIdIndex: {
                readonly universalIdentifier: "9bb24d40-60dd-4beb-8c64-a74e8c67f9ee";
            };
            readonly messageChannelIdMessageIdUniqueIndex: {
                readonly universalIdentifier: "1b86ece8-7ce3-4df3-8771-fd4b5d45b2f2";
            };
        };
        readonly views: {
            readonly allMessageChannelMessageAssociations: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "direction" | "message" | "messageChannelId" | "messageExternalId", {
                    universalIdentifier: string;
                }>;
            };
            readonly messageChannelMessageAssociationRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "direction" | "message" | "messageChannelId" | "messageExternalId", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly messageChannelMessageAssociationMessageFolder: {
        readonly universalIdentifier: "20202020-a1b0-40b0-8ab0-5b6c7d8e9f0a";
        readonly fields: {
            messageChannelMessageAssociation: {
                universalIdentifier: string;
            };
            messageFolderId: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly messageChannelMessageAssociationIdIndex: {
                readonly universalIdentifier: "8e6038aa-1f79-4a84-87b5-f33caa172e98";
            };
            readonly messageFolderIdIndex: {
                readonly universalIdentifier: "905299c3-ca81-435d-901c-f68b87562516";
            };
            readonly messageChannelMessageAssociationIdMessageFolderIdUniqueIndex: {
                readonly universalIdentifier: "a3de1788-5dff-4849-ac5a-0dabe5fab216";
            };
        };
        readonly views: {
            readonly allMessageChannelMessageAssociationMessageFolders: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "messageChannelMessageAssociation" | "messageFolderId", {
                    universalIdentifier: string;
                }>;
            };
            readonly messageChannelMessageAssociationMessageFolderRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "messageChannelMessageAssociation" | "messageFolderId", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly messageParticipant: {
        readonly universalIdentifier: "20202020-a433-4456-aa2d-fd9cb26b774a";
        readonly fields: {
            message: {
                universalIdentifier: string;
            };
            role: {
                universalIdentifier: string;
            };
            handle: {
                universalIdentifier: string;
            };
            displayName: {
                universalIdentifier: string;
            };
            person: {
                universalIdentifier: string;
            };
            workspaceMember: {
                universalIdentifier: string;
            };
            messageCampaign: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly messageIdIndex: {
                readonly universalIdentifier: "ab0863ba-f95e-493c-b86c-56e1bc7e5bc2";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "df805c2e-3bfe-4d51-8309-75e5eb4052fe";
            };
            readonly workspaceMemberIdIndex: {
                readonly universalIdentifier: "ce1e3a9e-afe9-439d-abb7-6cc98a6fa405";
            };
            readonly messageCampaignIdIndex: {
                readonly universalIdentifier: "e9bcdd77-cc8b-4532-833c-124dfdc8e5ff";
            };
        };
        readonly views: {
            readonly allMessageParticipants: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "displayName" | "handle" | "message" | "person" | "role" | "workspaceMember", {
                    universalIdentifier: string;
                }>;
            };
            readonly messageParticipantRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "displayName" | "message" | "person" | "role" | "workspaceMember", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly messageThread: {
        readonly universalIdentifier: "20202020-849a-4c3e-84f5-a25a7d802271";
        readonly fields: {
            messages: {
                universalIdentifier: string;
            };
            messageChannelMessageAssociations: {
                universalIdentifier: string;
            };
            subject: {
                universalIdentifier: string;
            };
            messageThreadTargets: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {};
        readonly views: {
            readonly allMessageThreads: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "messages" | "subject" | "updatedAt", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly messageThreadTarget: {
        readonly universalIdentifier: "378ad1b0-592d-4084-80ee-86fef44725b9";
        readonly fields: {
            messageThread: {
                universalIdentifier: string;
            };
            isAutomaticallyAssigned: {
                universalIdentifier: string;
            };
            isManuallyAssigned: {
                universalIdentifier: string;
            };
            targetPerson: {
                universalIdentifier: string;
            };
            targetCompany: {
                universalIdentifier: string;
            };
            targetOpportunity: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly morphIds: {
            readonly targetMorphId: {
                readonly morphId: "e85e853d-c26e-41b3-bec0-7afc4bdbc2f7";
            };
        };
        readonly indexes: {
            readonly messageThreadIdIndex: {
                readonly universalIdentifier: "222fdd8b-0863-4f2a-816a-29745537b6b6";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "280ee419-ac3c-4599-bd62-3e5cb268342c";
            };
            readonly companyIdIndex: {
                readonly universalIdentifier: "b98005e4-3811-41b6-82d0-3ccd27757eba";
            };
            readonly opportunityIdIndex: {
                readonly universalIdentifier: "7679ee05-cf6c-40a7-9ee6-c3e8053caca5";
            };
            readonly messageThreadPersonUniqueIndex: {
                readonly universalIdentifier: "087f97cb-8c3c-4ea1-9556-933acde6c83b";
            };
            readonly messageThreadCompanyUniqueIndex: {
                readonly universalIdentifier: "30d4f1af-8b6f-4685-802f-8a7cf29f318b";
            };
            readonly messageThreadOpportunityUniqueIndex: {
                readonly universalIdentifier: "1dc0e37e-afb1-4e90-90b4-052374126a6a";
            };
        };
        readonly views: {};
    };
    readonly message: {
        readonly universalIdentifier: "20202020-3f6b-4425-80ab-e468899ab4b2";
        readonly fields: {
            headerMessageId: {
                universalIdentifier: string;
            };
            messageThread: {
                universalIdentifier: string;
            };
            subject: {
                universalIdentifier: string;
            };
            text: {
                universalIdentifier: string;
            };
            receivedAt: {
                universalIdentifier: string;
            };
            messageParticipants: {
                universalIdentifier: string;
            };
            messageChannelMessageAssociations: {
                universalIdentifier: string;
            };
            messageCampaign: {
                universalIdentifier: string;
            };
            isDraft: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly messageThreadIdIndex: {
                readonly universalIdentifier: "7a05b45e-7aa6-4a7e-9bbc-299cbed53c96";
            };
            readonly messageCampaignIdIndex: {
                readonly universalIdentifier: "79e777ca-7008-46c5-b3a6-3108b7c7dfb6";
            };
            readonly headerMessageIdIndex: {
                readonly universalIdentifier: "0904b3e4-6052-4a8d-bf41-f12a27c7e34a";
            };
        };
        readonly views: {
            readonly allMessages: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "headerMessageId" | "messageParticipants" | "messageThread" | "receivedAt" | "subject" | "text", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly note: {
        readonly universalIdentifier: "20202020-0b00-45cd-b6f6-6cd806fc6804";
        readonly fields: {
            title: {
                universalIdentifier: string;
            };
            bodyV2: {
                universalIdentifier: string;
            };
            noteTargets: {
                universalIdentifier: string;
            };
            attachments: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "8183c8d2-9114-4b6e-8c5d-12a3b14a5a13";
            };
        };
        readonly views: {
            readonly allNotes: {
                universalIdentifier: string;
                viewFields: Record<"bodyV2" | "createdAt" | "createdBy" | "noteTargets" | "title", {
                    universalIdentifier: string;
                }>;
            };
            readonly noteRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"attachments" | "noteTargets" | "timelineActivities", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly noteTarget: {
        readonly universalIdentifier: "20202020-fff0-4b44-be82-bda313884400";
        readonly fields: {
            note: {
                universalIdentifier: string;
            };
            targetPerson: {
                universalIdentifier: string;
            };
            targetCompany: {
                universalIdentifier: string;
            };
            targetOpportunity: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly morphIds: {
            readonly targetMorphId: {
                readonly morphId: "20202020-f635-435d-ab8d-e1168b375c70";
            };
        };
        readonly indexes: {
            readonly noteIdIndex: {
                readonly universalIdentifier: "9294d9e3-0225-4c7f-9d6e-23b4c25b6b24";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "7c069dc0-e83b-4cd5-aaa2-cac7f3e00d80";
            };
            readonly companyIdIndex: {
                readonly universalIdentifier: "2d83909a-a383-4e82-b00a-8b7739f3f906";
            };
            readonly opportunityIdIndex: {
                readonly universalIdentifier: "0d1a59b4-cc87-4b7d-804a-656e8504f371";
            };
        };
        readonly views: {
            readonly allNoteTargets: {
                universalIdentifier: string;
                viewFields: Record<"id" | "note" | "targetCompany" | "targetOpportunity" | "targetPerson", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly opportunity: {
        readonly universalIdentifier: "20202020-9549-49dd-b2b2-883999db8938";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            amount: {
                universalIdentifier: string;
            };
            closeDate: {
                universalIdentifier: string;
            };
            stage: {
                universalIdentifier: string;
            };
            pointOfContact: {
                universalIdentifier: string;
            };
            company: {
                universalIdentifier: string;
            };
            owner: {
                universalIdentifier: string;
            };
            taskTargets: {
                universalIdentifier: string;
            };
            noteTargets: {
                universalIdentifier: string;
            };
            calendarEventTargets: {
                universalIdentifier: string;
            };
            messageThreadTargets: {
                universalIdentifier: string;
            };
            attachments: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly pointOfContactIdIndex: {
                readonly universalIdentifier: "b8c2a673-a981-4357-a43d-313a358e4daa";
            };
            readonly companyIdIndex: {
                readonly universalIdentifier: "e161072d-37b1-477a-b944-ef0d65289574";
            };
            readonly stageIndex: {
                readonly universalIdentifier: "ae60d580-b562-44f2-a24d-7b8040063f83";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "f53fdd28-a26b-47ba-81b5-6813ad622720";
            };
        };
        readonly views: {
            readonly allOpportunities: {
                universalIdentifier: string;
                viewFields: Record<"amount" | "closeDate" | "company" | "createdBy" | "name" | "pointOfContact", {
                    universalIdentifier: string;
                }>;
            };
            readonly byStage: {
                readonly universalIdentifier: "20202020-a004-4a04-8a04-0aa0b1ca1ba0";
                readonly viewFields: {
                    readonly name: {
                        readonly universalIdentifier: "20202020-af04-4a04-8a04-0aa0b2ca2baf";
                    };
                    readonly amount: {
                        readonly universalIdentifier: "20202020-af04-4a04-8a04-0aa0b2ca2bb0";
                    };
                    readonly createdBy: {
                        readonly universalIdentifier: "20202020-af04-4a04-8a04-0aa0b2ca2bb1";
                    };
                    readonly closeDate: {
                        readonly universalIdentifier: "20202020-af04-4a04-8a04-0aa0b2ca2bb2";
                    };
                    readonly company: {
                        readonly universalIdentifier: "20202020-af04-4a04-8a04-0aa0b2ca2bb3";
                    };
                    readonly pointOfContact: {
                        readonly universalIdentifier: "20202020-af04-4a04-8a04-0aa0b2ca2bb4";
                    };
                };
                readonly viewGroups: {
                    readonly new: {
                        readonly universalIdentifier: "20202020-af14-4a04-8a04-0aa0b2ca2bf1";
                    };
                    readonly screening: {
                        readonly universalIdentifier: "20202020-af14-4a04-8a04-0aa0b2ca2bf2";
                    };
                    readonly meeting: {
                        readonly universalIdentifier: "20202020-af14-4a04-8a04-0aa0b2ca2bf3";
                    };
                    readonly proposal: {
                        readonly universalIdentifier: "20202020-af14-4a04-8a04-0aa0b2ca2bf4";
                    };
                    readonly customer: {
                        readonly universalIdentifier: "20202020-af14-4a04-8a04-0aa0b2ca2bf5";
                    };
                };
            };
            readonly opportunityRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"amount" | "attachments" | "closeDate" | "company" | "createdAt" | "createdBy" | "noteTargets" | "owner" | "pointOfContact" | "stage" | "taskTargets" | "timelineActivities" | "updatedAt" | "updatedBy", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"deal" | "relations" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly person: {
        readonly universalIdentifier: "20202020-e674-48e5-a542-72570eee7213";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            emails: {
                universalIdentifier: string;
            };
            linkedinLink: {
                universalIdentifier: string;
            };
            jobTitle: {
                universalIdentifier: string;
            };
            phones: {
                universalIdentifier: string;
            };
            avatarUrl: {
                universalIdentifier: string;
            };
            avatarFile: {
                universalIdentifier: string;
            };
            company: {
                universalIdentifier: string;
            };
            pointOfContactForOpportunities: {
                universalIdentifier: string;
            };
            taskTargets: {
                universalIdentifier: string;
            };
            noteTargets: {
                universalIdentifier: string;
            };
            calendarEventTargets: {
                universalIdentifier: string;
            };
            messageThreadTargets: {
                universalIdentifier: string;
            };
            attachments: {
                universalIdentifier: string;
            };
            messageParticipants: {
                universalIdentifier: string;
            };
            calendarEventParticipants: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            listMemberships: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly companyIdIndex: {
                readonly universalIdentifier: "8a265a5c-d3ae-47dc-bdf9-b42cfa2ba639";
            };
            readonly emailsUniqueIndex: {
                readonly universalIdentifier: "8183a8b2-9114-4f6c-8a5b-12e3f14e5e13";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "9294b9c3-0225-4a7d-9b6c-23f4a25f6f24";
            };
        };
        readonly views: {
            readonly allPeople: {
                universalIdentifier: string;
                viewFields: Record<"company" | "createdAt" | "createdBy" | "emails" | "jobTitle" | "linkedinLink" | "name" | "phones", {
                    universalIdentifier: string;
                }>;
            };
            readonly personRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"attachments" | "avatarFile" | "avatarUrl" | "calendarEventParticipants" | "company" | "createdAt" | "createdBy" | "emails" | "jobTitle" | "linkedinLink" | "messageParticipants" | "noteTargets" | "phones" | "pointOfContactForOpportunities" | "taskTargets" | "timelineActivities" | "updatedAt" | "updatedBy", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "social" | "system" | "work", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly task: {
        readonly universalIdentifier: "20202020-1ba1-48ba-bc83-ef7e5990ed10";
        readonly fields: {
            title: {
                universalIdentifier: string;
            };
            bodyV2: {
                universalIdentifier: string;
            };
            dueAt: {
                universalIdentifier: string;
            };
            status: {
                universalIdentifier: string;
            };
            taskTargets: {
                universalIdentifier: string;
            };
            attachments: {
                universalIdentifier: string;
            };
            assignee: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly assigneeIdIndex: {
                readonly universalIdentifier: "f48fa3b1-0cec-44da-a9e5-f8a5e766637e";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "a86b32b3-01d3-4302-a152-8b7f247db7b4";
            };
        };
        readonly views: {
            readonly allTasks: {
                universalIdentifier: string;
                viewFields: Record<"assignee" | "bodyV2" | "createdAt" | "createdBy" | "dueAt" | "status" | "taskTargets" | "title", {
                    universalIdentifier: string;
                }>;
            };
            readonly assignedToMe: {
                readonly universalIdentifier: "20202020-a007-4a07-8a07-ba5ca551aaed";
                readonly viewFields: {
                    readonly title: {
                        readonly universalIdentifier: "20202020-af07-4a07-8a07-ba5ca551aaed";
                    };
                    readonly taskTargets: {
                        readonly universalIdentifier: "20202020-af07-4a07-8a07-ba5ca551aaee";
                    };
                    readonly createdBy: {
                        readonly universalIdentifier: "20202020-af07-4a07-8a07-ba5ca551aaef";
                    };
                    readonly dueAt: {
                        readonly universalIdentifier: "20202020-af07-4a07-8a07-ba5ca551aaf0";
                    };
                    readonly assignee: {
                        readonly universalIdentifier: "20202020-af07-4a07-8a07-ba5ca551aaf1";
                    };
                    readonly bodyV2: {
                        readonly universalIdentifier: "20202020-af07-4a07-8a07-ba5ca551aaf2";
                    };
                    readonly createdAt: {
                        readonly universalIdentifier: "20202020-af07-4a07-8a07-ba5ca551aaf3";
                    };
                };
                readonly viewFilters: {
                    readonly assigneeIsMe: {
                        readonly universalIdentifier: "20202020-af17-4a07-8a07-ba5ca551abf1";
                    };
                };
                readonly viewGroups: {
                    readonly todo: {
                        readonly universalIdentifier: "20202020-af17-4a07-8a07-ba5ca551abf2";
                    };
                    readonly inProgress: {
                        readonly universalIdentifier: "20202020-af17-4a07-8a07-ba5ca551abf3";
                    };
                    readonly done: {
                        readonly universalIdentifier: "20202020-af17-4a07-8a07-ba5ca551abf4";
                    };
                    readonly empty: {
                        readonly universalIdentifier: "20202020-af17-4a07-8a07-ba5ca551abf5";
                    };
                };
            };
            readonly byStatus: {
                readonly universalIdentifier: "20202020-a008-4a08-8a08-ba5cba51aba5";
                readonly viewFields: {
                    readonly title: {
                        readonly universalIdentifier: "20202020-af08-4a08-8a08-ba5cba5babf0";
                    };
                    readonly status: {
                        readonly universalIdentifier: "20202020-af08-4a08-8a08-ba5cba5babf1";
                    };
                    readonly dueAt: {
                        readonly universalIdentifier: "20202020-af08-4a08-8a08-ba5cba5babf2";
                    };
                    readonly assignee: {
                        readonly universalIdentifier: "20202020-af08-4a08-8a08-ba5cba5babf3";
                    };
                    readonly createdAt: {
                        readonly universalIdentifier: "20202020-af08-4a08-8a08-ba5cba5babf4";
                    };
                };
                readonly viewGroups: {
                    readonly todo: {
                        readonly universalIdentifier: "20202020-af18-4a08-8a08-ba5cba5bbf01";
                    };
                    readonly inProgress: {
                        readonly universalIdentifier: "20202020-af18-4a08-8a08-ba5cba5bbf02";
                    };
                    readonly done: {
                        readonly universalIdentifier: "20202020-af18-4a08-8a08-ba5cba5bbf03";
                    };
                };
            };
            readonly taskRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"assignee" | "attachments" | "dueAt" | "status" | "taskTargets" | "timelineActivities", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly taskTarget: {
        readonly universalIdentifier: "20202020-5a9a-44e8-95df-771cd06d0fb1";
        readonly fields: {
            task: {
                universalIdentifier: string;
            };
            targetPerson: {
                universalIdentifier: string;
            };
            targetCompany: {
                universalIdentifier: string;
            };
            targetOpportunity: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly morphIds: {
            readonly targetMorphId: {
                readonly morphId: "20202020-f636-435d-ab8d-e1168b375c71";
            };
        };
        readonly indexes: {
            readonly taskIdIndex: {
                readonly universalIdentifier: "c882f7a4-b025-4d32-aa26-5ef2595bdbf9";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "b7d305d1-6fae-4ed6-9bdc-354fe9032c0e";
            };
            readonly companyIdIndex: {
                readonly universalIdentifier: "c0af54c7-751b-4bb2-b102-677cc4e47402";
            };
            readonly opportunityIdIndex: {
                readonly universalIdentifier: "6942e0ba-90f6-4c33-bf40-7f00b1ec35ab";
            };
        };
        readonly views: {
            readonly allTaskTargets: {
                universalIdentifier: string;
                viewFields: Record<"id" | "targetCompany" | "targetOpportunity" | "targetPerson" | "task", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly timelineActivity: {
        readonly universalIdentifier: "20202020-6736-4337-b5c4-8b39fae325a5";
        readonly fields: {
            timelineActivityTypeId: {
                universalIdentifier: string;
            };
            timelineActivityTypeSnapshot: {
                universalIdentifier: string;
            };
            happensAt: {
                universalIdentifier: string;
            };
            properties: {
                universalIdentifier: string;
            };
            workspaceMember: {
                universalIdentifier: string;
            };
            targetPerson: {
                universalIdentifier: string;
            };
            targetCompany: {
                universalIdentifier: string;
            };
            targetOpportunity: {
                universalIdentifier: string;
            };
            targetTask: {
                universalIdentifier: string;
            };
            targetNote: {
                universalIdentifier: string;
            };
            targetWorkflow: {
                universalIdentifier: string;
            };
            targetWorkflowVersion: {
                universalIdentifier: string;
            };
            targetWorkflowRun: {
                universalIdentifier: string;
            };
            targetDashboard: {
                universalIdentifier: string;
            };
            targetMessageList: {
                universalIdentifier: string;
            };
            targetMessageCampaign: {
                universalIdentifier: string;
            };
            linkedRecordCachedName: {
                universalIdentifier: string;
            };
            linkedRecordId: {
                universalIdentifier: string;
            };
            linkedObjectMetadataId: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly morphIds: {
            readonly targetMorphId: {
                readonly morphId: "20202020-9a2b-4c3d-a4e5-f6a7b8c9d0e1";
            };
        };
        readonly indexes: {
            readonly workspaceMemberIdIndex: {
                readonly universalIdentifier: "5e0b2391-85ca-4a66-aef4-52d74245bec2";
            };
            readonly personIdIndex: {
                readonly universalIdentifier: "3e89a914-7bec-47bd-9cf9-743c6b83d001";
            };
            readonly companyIdIndex: {
                readonly universalIdentifier: "8183e8f2-9114-4d6a-8e5f-12c3d14c5c13";
            };
            readonly opportunityIdIndex: {
                readonly universalIdentifier: "9294f9a3-0225-4e7b-9f6a-23d4e25d6d24";
            };
            readonly noteIdIndex: {
                readonly universalIdentifier: "995db1d8-0d3e-40f7-b0eb-5e6897bc9966";
            };
            readonly taskIdIndex: {
                readonly universalIdentifier: "609cf622-86ef-48d1-812b-e1cab610a46c";
            };
            readonly workflowIdIndex: {
                readonly universalIdentifier: "d6059ec2-92b0-4cfc-9fd8-78050f03108f";
            };
            readonly workflowVersionIdIndex: {
                readonly universalIdentifier: "d94329b3-5dc8-4141-ae28-31afe28f7135";
            };
            readonly workflowRunIdIndex: {
                readonly universalIdentifier: "1a2bd046-7c23-4e0a-9f8a-c3ca3a16d3b9";
            };
            readonly dashboardIdIndex: {
                readonly universalIdentifier: "e8821da9-728d-470a-bf5b-5a981fff7880";
            };
        };
        readonly views: {
            readonly allTimelineActivities: {
                universalIdentifier: string;
                viewFields: Record<"happensAt" | "linkedRecordCachedName" | "targetCompany" | "targetDashboard" | "targetNote" | "targetOpportunity" | "targetPerson" | "targetTask" | "targetWorkflow" | "targetWorkflowRun" | "targetWorkflowVersion" | "workspaceMember", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly workflow: {
        readonly universalIdentifier: "20202020-62be-406c-b9ca-8caa50d51392";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            lastPublishedVersionId: {
                universalIdentifier: string;
            };
            coreWorkflowId: {
                universalIdentifier: string;
            };
            statuses: {
                universalIdentifier: string;
            };
            versions: {
                universalIdentifier: string;
            };
            runs: {
                universalIdentifier: string;
            };
            automatedTriggers: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            attachments: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "c7e64c55-eb0c-4b93-b076-5cfcf2e2e042";
            };
        };
        readonly views: {
            readonly allWorkflows: {
                universalIdentifier: string;
                viewFields: Record<"createdBy" | "name" | "runs" | "statuses" | "updatedAt" | "versions", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly workflowAutomatedTrigger: {
        readonly universalIdentifier: "20202020-3319-4234-a34c-7f3b9d2e4d1f";
        readonly fields: {
            type: {
                universalIdentifier: string;
            };
            settings: {
                universalIdentifier: string;
            };
            workflow: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly workflowIdIndex: {
                readonly universalIdentifier: "7331ff89-a3f9-4ac0-9fa9-0de5663ae7b2";
            };
        };
        readonly views: {
            readonly allWorkflowAutomatedTriggers: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "type" | "workflow", {
                    universalIdentifier: string;
                }>;
            };
            readonly workflowAutomatedTriggerRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "type" | "workflow", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly workflowRun: {
        readonly universalIdentifier: "20202020-4e28-4e95-a9d7-6c00874f843c";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            workflowVersion: {
                universalIdentifier: string;
            };
            workflow: {
                universalIdentifier: string;
            };
            enqueuedAt: {
                universalIdentifier: string;
            };
            startedAt: {
                universalIdentifier: string;
            };
            endedAt: {
                universalIdentifier: string;
            };
            status: {
                universalIdentifier: string;
            };
            state: {
                universalIdentifier: string;
            };
            stepLogs: {
                universalIdentifier: string;
            };
            coreWorkflowId: {
                universalIdentifier: string;
            };
            coreWorkflowVersionId: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly workflowVersionIdIndex: {
                readonly universalIdentifier: "8183c8d2-9114-4b6e-8c5d-12a3b14a5a14";
            };
            readonly workflowIdIndex: {
                readonly universalIdentifier: "9294d9e3-0225-4c7f-9d6e-23b4c25b6b25";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "e0ac5ad2-d0c8-4f72-b710-8e53b9dc18d9";
            };
        };
        readonly views: {
            readonly allWorkflowRuns: {
                universalIdentifier: string;
                viewFields: Record<"name" | "status" | "workflow", {
                    universalIdentifier: string;
                }>;
            };
            readonly workflowRunRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "endedAt" | "enqueuedAt" | "startedAt" | "state" | "status" | "timelineActivities" | "updatedAt" | "updatedBy" | "workflow" | "workflowVersion", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly workflowVersion: {
        readonly universalIdentifier: "20202020-d65d-4ab9-9344-d77bfb376a3d";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            workflow: {
                universalIdentifier: string;
            };
            trigger: {
                universalIdentifier: string;
            };
            status: {
                universalIdentifier: string;
            };
            runs: {
                universalIdentifier: string;
            };
            steps: {
                universalIdentifier: string;
            };
            coreWorkflowVersionId: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly workflowIdIndex: {
                readonly universalIdentifier: "8138c3b3-0b14-4ee1-be0e-debdde6b3219";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "6f3a65eb-2aee-4108-b8a0-c62da419d1dc";
            };
        };
        readonly views: {
            readonly allWorkflowVersions: {
                universalIdentifier: string;
                viewFields: Record<"name" | "runs" | "status" | "updatedAt" | "workflow", {
                    universalIdentifier: string;
                }>;
            };
            readonly workflowVersionRecordPageFields: {
                universalIdentifier: string;
                viewFields: Record<"createdAt" | "createdBy" | "runs" | "status" | "steps" | "timelineActivities" | "trigger" | "updatedAt" | "updatedBy" | "workflow", {
                    universalIdentifier: string;
                }>;
                viewFieldGroups: Record<"general" | "system", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
    readonly workspaceMember: {
        readonly universalIdentifier: "20202020-3319-4234-a34c-82d5c0e881a6";
        readonly fields: {
            name: {
                universalIdentifier: string;
            };
            colorScheme: {
                universalIdentifier: string;
            };
            uiScale: {
                universalIdentifier: string;
            };
            openRecordIn: {
                universalIdentifier: string;
            };
            locale: {
                universalIdentifier: string;
            };
            avatarUrl: {
                universalIdentifier: string;
            };
            userEmail: {
                universalIdentifier: string;
            };
            jobTitle: {
                universalIdentifier: string;
            };
            userId: {
                universalIdentifier: string;
            };
            assignedTasks: {
                universalIdentifier: string;
            };
            ownedOpportunities: {
                universalIdentifier: string;
            };
            accountOwnerForCompanies: {
                universalIdentifier: string;
            };
            messageParticipants: {
                universalIdentifier: string;
            };
            blocklist: {
                universalIdentifier: string;
            };
            calendarEventParticipants: {
                universalIdentifier: string;
            };
            timelineActivities: {
                universalIdentifier: string;
            };
            timeZone: {
                universalIdentifier: string;
            };
            dateFormat: {
                universalIdentifier: string;
            };
            timeFormat: {
                universalIdentifier: string;
            };
            calendarStartDay: {
                universalIdentifier: string;
            };
            numberFormat: {
                universalIdentifier: string;
            };
            createdAt: {
                universalIdentifier: string;
            };
            createdBy: {
                universalIdentifier: string;
            };
            deletedAt: {
                universalIdentifier: string;
            };
            id: {
                universalIdentifier: string;
            };
            position: {
                universalIdentifier: string;
            };
            searchVector: {
                universalIdentifier: string;
            };
            updatedAt: {
                universalIdentifier: string;
            };
            updatedBy: {
                universalIdentifier: string;
            };
        };
        readonly indexes: {
            readonly userEmailUniqueIndex: {
                readonly universalIdentifier: "76da5f27-523c-44b6-ad06-12954f6b949f";
            };
            readonly searchVectorGinIndex: {
                readonly universalIdentifier: "8678dde9-a804-4a9e-80e3-9af35e471ec5";
            };
        };
        readonly views: {
            readonly allWorkspaceMembers: {
                universalIdentifier: string;
                viewFields: Record<"assignedTasks" | "createdAt" | "name" | "ownedOpportunities", {
                    universalIdentifier: string;
                }>;
            };
        };
    };
};
//# sourceMappingURL=standard-object.constant.d.ts.map