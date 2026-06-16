import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postApiunitsIdexercises_Body = z.array(
  z.object({
    correctMessage: z.union([z.string(), z.null()]).optional(),
    incorrectMessage: z.union([z.string(), z.null()]).optional(),
    questionContent: z.string().optional(),
    answers: z
      .union([
        z.array(
          z
            .object({
              text: z.union([
                z.union([z.array(z.string()), z.string()]),
                z.null(),
              ]),
              audio: z.union([z.string(), z.null()]),
            })
            .partial()
        ),
        z.null(),
      ])
      .optional(),
    options: z.array(z.string()),
    audio: z.union([z.string(), z.null()]).optional(),
    courseId: z.number().int().optional(),
    instruction: z.string(),
    answerType: z.enum(["freetext", "bubbles"]).optional(),
  })
);
const postApiauthlogin_Body = z.object({
  email: z.string(),
  password: z.string(),
});
const postApiauthregisterstudent_Body = z.object({
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string().optional(),
  deviceUuid: z.string().optional(),
});
const postApicoursesIdunits_Body = z.array(
  z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(["lesson", "practice"]),
    level: z.number().int(),
  })
);
const postApiunitsIdexercisesmove_Body = z.object({
  unitId: z.number().int().optional(),
  exerciseIds: z.array(z.number().int()).optional(),
});
const postApicoursesId_Body = z
  .object({
    name: z.union([z.string(), z.null()]),
    language: z.union([z.string(), z.null()]),
    status: z.union([z.string(), z.null()]),
    description: z.union([z.string(), z.null()]),
    creatorId: z.union([z.number(), z.null()]),
  })
  .partial();
const postApivocabId_Body = z
  .object({
    xhosa: z.union([z.string(), z.null()]),
    english: z.union([z.string(), z.null()]),
    illustration: z.union([z.string(), z.null()]),
    nounClass: z.union([z.string(), z.null()]),
    type: z.union([z.string(), z.null()]),
  })
  .partial();
const type = z.union([z.string(), z.null()]).optional();
const postApivocab_Body = z.array(
  z.object({
    xhosa: z.string(),
    english: z.string(),
    illustration: z.union([z.string(), z.null()]).optional(),
    nounClass: z.union([z.string(), z.null()]).optional(),
    type: z.string(),
  })
);
const postApistudentsessionendId_Body = z.object({
  sessionId: z.number().int().optional(),
  answers: z.array(
    z.object({
      exerciseId: z.number().int().optional(),
      answer: z.union([z.array(z.string()), z.string()]),
      startedAt: z.string().optional(),
      endedAt: z.string().optional(),
    })
  ),
});
const postApiunitsId_Body = z
  .object({
    id: z.number().int(),
    courseId: z.number().int(),
    name: z.string(),
    description: z.string(),
    type: z.enum(["lesson", "practice"]),
    level: z.number().int(),
  })
  .partial();
const postApiexercisesId_Body = z
  .object({
    correctMessage: z.union([z.string(), z.null()]),
    incorrectMessage: z.union([z.string(), z.null()]),
    questionContent: z.union([z.string(), z.null()]),
    answers: z.union([
      z.array(
        z
          .object({
            text: z.union([
              z.union([z.array(z.string()), z.string()]),
              z.null(),
            ]),
            audio: z.union([z.string(), z.null()]),
          })
          .partial()
      ),
      z.null(),
    ]),
    options: z.union([z.array(z.string()), z.null()]),
    unitId: z.union([z.number(), z.null()]),
    audio: z.union([z.string(), z.null()]),
    instruction: z.union([z.string(), z.null()]),
    answerType: z.union([z.enum(["freetext", "bubbles"]), z.null()]),
  })
  .partial();
const postApimediaaudio_Body = z.array(
  z.object({ audio: z.string(), id: z.string() })
);
const postApicourses_Body = z.object({
  name: z.string(),
  language: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
  units: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      type: z.enum(["lesson", "practice"]),
      level: z.number().int(),
    })
  ),
});

export const schemas = {
  postApiunitsIdexercises_Body,
  postApiauthlogin_Body,
  postApiauthregisterstudent_Body,
  postApicoursesIdunits_Body,
  postApiunitsIdexercisesmove_Body,
  postApicoursesId_Body,
  postApivocabId_Body,
  type,
  postApivocab_Body,
  postApistudentsessionendId_Body,
  postApiunitsId_Body,
  postApiexercisesId_Body,
  postApimediaaudio_Body,
  postApicourses_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/api/auth/email/verify",
    alias: "postApiauthemailverify",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ emailHash: z.string().optional() }),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 404,
        schema: z.object({
          message: z.string(),
          data: z.object({ message: z.string() }),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/auth/jag",
    alias: "getApiauthjag",
    requestFormat: "json",
    response: z.object({
      id: z.number().int(),
      email: z.string(),
      firstname: z.union([z.string(), z.null()]).optional(),
      lastname: z.union([z.string(), z.null()]).optional(),
      emailVerified: z.boolean().optional(),
      mobile: z.union([z.string(), z.null()]).optional(),
      profileImage: z.union([z.string(), z.null()]).optional(),
      role: z.string(),
    }),
  },
  {
    method: "post",
    path: "/api/auth/login",
    alias: "postApiauthlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiauthlogin_Body,
      },
    ],
    response: z.object({
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 401,
        schema: z.object({
          message: z.string(),
          data: z.object({ message: z.string() }),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/auth/register/student",
    alias: "postApiauthregisterstudent",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiauthregisterstudent_Body,
      },
    ],
    response: z.object({
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 401,
        schema: z.object({
          message: z.string(),
          data: z.object({ message: z.string() }),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/courses",
    alias: "getApicourses",
    requestFormat: "json",
    response: z.array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        language: z.string(),
        description: z.union([z.string(), z.null()]).optional(),
        status: z.string(),
        creator: z
          .union([
            z.object({
              id: z.number().int(),
              email: z.string(),
              firstname: z.union([z.string(), z.null()]).optional(),
              lastname: z.union([z.string(), z.null()]).optional(),
              emailVerified: z.boolean().optional(),
              mobile: z.union([z.string(), z.null()]).optional(),
              profileImage: z.union([z.string(), z.null()]).optional(),
              role: z.string(),
            }),
            z.null(),
          ])
          .optional(),
        units: z.array(
          z.object({
            id: z.number().int(),
            courseId: z.number().int().optional(),
            name: z.string(),
            description: z.string(),
            type: z.enum(["lesson", "practice"]),
            level: z.number().int(),
          })
        ),
      })
    ),
  },
  {
    method: "post",
    path: "/api/courses",
    alias: "postApicourses",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApicourses_Body,
      },
    ],
    response: z.object({
      id: z.number().int(),
      name: z.string(),
      language: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      status: z.string(),
      creator: z
        .union([
          z.object({
            id: z.number().int(),
            email: z.string(),
            firstname: z.union([z.string(), z.null()]).optional(),
            lastname: z.union([z.string(), z.null()]).optional(),
            emailVerified: z.boolean().optional(),
            mobile: z.union([z.string(), z.null()]).optional(),
            profileImage: z.union([z.string(), z.null()]).optional(),
            role: z.string(),
          }),
          z.null(),
        ])
        .optional(),
      units: z.array(
        z.object({
          id: z.number().int(),
          courseId: z.number().int().optional(),
          name: z.string(),
          description: z.string(),
          type: z.enum(["lesson", "practice"]),
          level: z.number().int(),
        })
      ),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/courses/:id",
    alias: "getApicoursesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      id: z.number().int(),
      name: z.string(),
      language: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      status: z.string(),
      creator: z
        .union([
          z.object({
            id: z.number().int(),
            email: z.string(),
            firstname: z.union([z.string(), z.null()]).optional(),
            lastname: z.union([z.string(), z.null()]).optional(),
            emailVerified: z.boolean().optional(),
            mobile: z.union([z.string(), z.null()]).optional(),
            profileImage: z.union([z.string(), z.null()]).optional(),
            role: z.string(),
          }),
          z.null(),
        ])
        .optional(),
      units: z.array(
        z.object({
          id: z.number().int(),
          courseId: z.number().int().optional(),
          name: z.string(),
          description: z.string(),
          type: z.enum(["lesson", "practice"]),
          level: z.number().int(),
        })
      ),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/courses/:id",
    alias: "postApicoursesId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApicoursesId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      id: z.number().int(),
      name: z.string(),
      language: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      status: z.string(),
      creator: z
        .union([
          z.object({
            id: z.number().int(),
            email: z.string(),
            firstname: z.union([z.string(), z.null()]).optional(),
            lastname: z.union([z.string(), z.null()]).optional(),
            emailVerified: z.boolean().optional(),
            mobile: z.union([z.string(), z.null()]).optional(),
            profileImage: z.union([z.string(), z.null()]).optional(),
            role: z.string(),
          }),
          z.null(),
        ])
        .optional(),
      units: z.array(
        z.object({
          id: z.number().int(),
          courseId: z.number().int().optional(),
          name: z.string(),
          description: z.string(),
          type: z.enum(["lesson", "practice"]),
          level: z.number().int(),
        })
      ),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 404,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/courses/:id",
    alias: "deleteApicoursesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/courses/:id/instructions",
    alias: "getApicoursesIdinstructions",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.array(z.string()),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/courses/:id/units",
    alias: "getApicoursesIdunits",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.array(
      z.object({
        id: z.number().int(),
        courseId: z.number().int().optional(),
        name: z.string(),
        description: z.string(),
        type: z.enum(["lesson", "practice"]),
        level: z.number().int(),
      })
    ),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/courses/:id/units",
    alias: "postApicoursesIdunits",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApicoursesIdunits_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      message: z.string(),
      data: z.array(
        z.object({
          id: z.number().int(),
          courseId: z.number().int().optional(),
          name: z.string(),
          description: z.string(),
          type: z.enum(["lesson", "practice"]),
          level: z.number().int(),
        })
      ),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/exercises/:id",
    alias: "getApiexercisesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      correctMessage: z.union([z.string(), z.null()]).optional(),
      incorrectMessage: z.union([z.string(), z.null()]).optional(),
      questionContent: z.string().optional(),
      id: z.number().int(),
      answers: z.array(
        z
          .object({
            text: z.union([
              z.union([z.array(z.string()), z.string()]),
              z.null(),
            ]),
            audio: z.union([z.string(), z.null()]),
          })
          .partial()
      ),
      options: z.array(z.string()),
      unitId: z.number().int().optional(),
      audio: z.union([z.string(), z.null()]).optional(),
      instruction: z.string(),
      answerType: z.enum(["freetext", "bubbles"]).optional(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/exercises/:id",
    alias: "postApiexercisesId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiexercisesId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      correctMessage: z.union([z.string(), z.null()]).optional(),
      incorrectMessage: z.union([z.string(), z.null()]).optional(),
      questionContent: z.string().optional(),
      id: z.number().int(),
      answers: z.array(
        z
          .object({
            text: z.union([
              z.union([z.array(z.string()), z.string()]),
              z.null(),
            ]),
            audio: z.union([z.string(), z.null()]),
          })
          .partial()
      ),
      options: z.array(z.string()),
      unitId: z.number().int().optional(),
      audio: z.union([z.string(), z.null()]).optional(),
      instruction: z.string(),
      answerType: z.enum(["freetext", "bubbles"]).optional(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/exercises/:id",
    alias: "deleteApiexercisesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/media/audio",
    alias: "getApimediaaudio",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.object({ audio: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/media/audio",
    alias: "postApimediaaudio",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApimediaaudio_Body,
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/student/courses",
    alias: "getApistudentcourses",
    requestFormat: "json",
    response: z.array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        language: z.string(),
        description: z.union([z.string(), z.null()]).optional(),
        status: z.string(),
        creator: z
          .union([
            z.object({
              id: z.number().int(),
              email: z.string(),
              firstname: z.union([z.string(), z.null()]).optional(),
              lastname: z.union([z.string(), z.null()]).optional(),
              emailVerified: z.boolean().optional(),
              mobile: z.union([z.string(), z.null()]).optional(),
              profileImage: z.union([z.string(), z.null()]).optional(),
              role: z.string(),
            }),
            z.null(),
          ])
          .optional(),
        units: z.array(
          z.object({
            id: z.number().int(),
            courseId: z.number().int().optional(),
            name: z.string(),
            description: z.string(),
            type: z.enum(["lesson", "practice"]),
            level: z.number().int(),
          })
        ),
      })
    ),
  },
  {
    method: "get",
    path: "/api/student/courses/:id",
    alias: "getApistudentcoursesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      id: z.number().int(),
      name: z.string(),
      language: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      status: z.string(),
      creator: z
        .union([
          z.object({
            id: z.number().int(),
            email: z.string(),
            firstname: z.union([z.string(), z.null()]).optional(),
            lastname: z.union([z.string(), z.null()]).optional(),
            emailVerified: z.boolean().optional(),
            mobile: z.union([z.string(), z.null()]).optional(),
            profileImage: z.union([z.string(), z.null()]).optional(),
            role: z.string(),
          }),
          z.null(),
        ])
        .optional(),
      units: z.array(
        z.object({
          id: z.number().int(),
          courseId: z.number().int().optional(),
          name: z.string(),
          description: z.string(),
          type: z.enum(["lesson", "practice"]),
          level: z.number().int(),
        })
      ),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/student/courses/:id",
    alias: "postApistudentcoursesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/student/courses/:id",
    alias: "deleteApistudentcoursesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/student/session/end/:id",
    alias: "postApistudentsessionendId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApistudentsessionendId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/student/session/start/:id",
    alias: "postApistudentsessionstartId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      sessionId: z.number().int().optional(),
      exercises: z.array(
        z.object({
          correctMessage: z.union([z.string(), z.null()]).optional(),
          incorrectMessage: z.union([z.string(), z.null()]).optional(),
          questionContent: z.string().optional(),
          id: z.number().int(),
          answers: z.array(
            z
              .object({
                text: z.union([
                  z.union([z.array(z.string()), z.string()]),
                  z.null(),
                ]),
                audio: z.union([z.string(), z.null()]),
              })
              .partial()
          ),
          options: z.array(z.string()),
          unitId: z.number().int().optional(),
          audio: z.union([z.string(), z.null()]).optional(),
          instruction: z.string(),
          answerType: z.enum(["freetext", "bubbles"]).optional(),
        })
      ),
      level: z.number().int(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/student/subscribable",
    alias: "getApistudentsubscribable",
    requestFormat: "json",
    response: z.array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        language: z.string(),
        description: z.union([z.string(), z.null()]).optional(),
        status: z.string(),
        creator: z
          .union([
            z.object({
              id: z.number().int(),
              email: z.string(),
              firstname: z.union([z.string(), z.null()]).optional(),
              lastname: z.union([z.string(), z.null()]).optional(),
              emailVerified: z.boolean().optional(),
              mobile: z.union([z.string(), z.null()]).optional(),
              profileImage: z.union([z.string(), z.null()]).optional(),
              role: z.string(),
            }),
            z.null(),
          ])
          .optional(),
        units: z.array(
          z.object({
            id: z.number().int(),
            courseId: z.number().int().optional(),
            name: z.string(),
            description: z.string(),
            type: z.enum(["lesson", "practice"]),
            level: z.number().int(),
          })
        ),
      })
    ),
  },
  {
    method: "get",
    path: "/api/units/:id",
    alias: "getApiunitsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      id: z.number().int(),
      courseId: z.number().int().optional(),
      name: z.string(),
      description: z.string(),
      type: z.enum(["lesson", "practice"]),
      level: z.number().int(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 404,
        schema: z.object({
          message: z.string(),
          data: z.object({ message: z.string() }),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/units/:id",
    alias: "postApiunitsId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiunitsId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      id: z.number().int(),
      courseId: z.number().int().optional(),
      name: z.string(),
      description: z.string(),
      type: z.enum(["lesson", "practice"]),
      level: z.number().int(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/units/:id",
    alias: "deleteApiunitsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 404,
        schema: z.object({
          message: z.string(),
          data: z.object({ message: z.string() }),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/units/:id/exercises",
    alias: "getApiunitsIdexercises",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.array(
      z.object({
        correctMessage: z.union([z.string(), z.null()]).optional(),
        incorrectMessage: z.union([z.string(), z.null()]).optional(),
        questionContent: z.string().optional(),
        id: z.number().int(),
        answers: z.array(
          z
            .object({
              text: z.union([
                z.union([z.array(z.string()), z.string()]),
                z.null(),
              ]),
              audio: z.union([z.string(), z.null()]),
            })
            .partial()
        ),
        options: z.array(z.string()),
        unitId: z.number().int().optional(),
        audio: z.union([z.string(), z.null()]).optional(),
        instruction: z.string(),
        answerType: z.enum(["freetext", "bubbles"]).optional(),
      })
    ),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/units/:id/exercises",
    alias: "postApiunitsIdexercises",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiunitsIdexercises_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/units/:id/exercises/move",
    alias: "postApiunitsIdexercisesmove",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiunitsIdexercisesmove_Body,
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/vocab",
    alias: "getApivocab",
    requestFormat: "json",
    parameters: [
      {
        name: "type",
        type: "Query",
        schema: type,
      },
      {
        name: "search",
        type: "Query",
        schema: type,
      },
    ],
    response: z.array(
      z.object({
        id: z.number().int(),
        xhosa: z.string(),
        english: z.string(),
        illustration: z.union([z.string(), z.null()]).optional(),
        nounClass: z.union([z.string(), z.null()]).optional(),
        type: z.string(),
      })
    ),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/vocab",
    alias: "postApivocab",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApivocab_Body,
      },
    ],
    response: z.array(
      z.object({
        id: z.number().int(),
        xhosa: z.string(),
        english: z.string(),
        illustration: z.union([z.string(), z.null()]).optional(),
        nounClass: z.union([z.string(), z.null()]).optional(),
        type: z.string(),
      })
    ),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/api/vocab/:id",
    alias: "getApivocabId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({
      id: z.number().int(),
      xhosa: z.string(),
      english: z.string(),
      illustration: z.union([z.string(), z.null()]).optional(),
      nounClass: z.union([z.string(), z.null()]).optional(),
      type: z.string(),
    }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 404,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/api/vocab/:id",
    alias: "postApivocabId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApivocabId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.array(
      z.object({
        id: z.number().int(),
        xhosa: z.string(),
        english: z.string(),
        illustration: z.union([z.string(), z.null()]).optional(),
        nounClass: z.union([z.string(), z.null()]).optional(),
        type: z.string(),
      })
    ),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 404,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/vocab/:id",
    alias: "deleteApivocabId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ message: z.string() }),
    errors: [
      {
        status: 400,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
