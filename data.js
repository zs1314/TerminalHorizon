"use strict";
// Values and case summaries: supplied ICLR_2027_agentic_data (4) manuscript.
const SITE_DATA = {
  domains: [
    "Software engineering & developer tools",
    "Languages, compilers & runtimes",
    "Operating & low-level systems",
    "Cloud & distributed infrastructure",
    "Networks & telecommunications",
    "Databases & storage",
    "Data engineering & analytics",
    "Machine learning & AI",
    "Security, cryptography & privacy",
    "Chips, electronics & embedded systems",
    "Robotics & autonomous systems",
    "Mathematics, statistics & formal methods",
    "Mechanical, thermal & aerospace engineering",
    "Earth, geospatial & environmental science",
    "Life sciences, medicine & health",
    "Chemistry, materials & molecular simulation",
    "Physics, astronomy & instrumentation",
    "Graphics, media & content tools",
    "Finance, accounting & economics",
    "Transportation, logistics & operations",
    "Manufacturing & production engineering",
    "Energy & public infrastructure",
    "Knowledge, humanities & public affairs",
    "Agriculture, forestry & fisheries",
    "Education & assessment",
  ],
  patterns: [
    {
      name: "Explore",
      title: "Information exploration and judgment",
      description:
        "Gather evidence, follow relationships, and use what is learned to decide where to look next.",
      items: [
        "Problem-driven exploration",
        "Relational tracing",
        "Multi-source evidence integration",
        "Candidate comparison and selection",
        "Tool and interface probing",
      ],
    },
    {
      name: "Diagnose",
      title: "Diagnosis and correction",
      description:
        "Turn a failure or discrepancy into a testable explanation, then modify and recheck the affected work.",
      items: [
        "Error-directed correction",
        "Hypothesis-driven diagnosis",
        "Reproduction-based diagnosis",
        "Differential and partition-based localization",
        "Runtime-guided localization",
        "Modification–recheck iteration",
      ],
    },
    {
      name: "Build",
      title: "Construction and work progression",
      description:
        "Establish prerequisites, extend partial results, and integrate them into a complete solution.",
      items: [
        "Subproblem decomposition and composition",
        "Dependency-driven progression",
        "Incremental construction and integration",
        "Measurement–comparison–tuning",
        "Item-wise processing and exception handling",
      ],
    },
    {
      name: "Verify",
      title: "Verification and result establishment",
      description:
        "Use meaningful checks to determine what is correct, what remains uncertain, and whether delivery is complete.",
      items: [
        "Multi-check verification",
        "Reference-based verification",
        "Independent cross-verification",
        "Stability rechecking",
        "Revalidation under changed conditions",
        "Requirement and delivery reconciliation",
      ],
    },
    {
      name: "Coordinate",
      title: "Strategy and execution coordination",
      description:
        "Revise the approach when evidence changes, coordinate dependent work, and manage execution over time.",
      items: [
        "Evidence-driven strategy revision",
        "Exploratory branching and backtracking",
        "Coupled-object coordination",
        "Asynchronous job management",
        "Sequential decision-making in dynamic environments",
      ],
    },
  ],
  episodes: [
    {
      title: "Repair retry",
      tag: "Diagnose · Build",
      observation: "The direct handshake works, but the retry path fails.",
      action: "Distinguish the two paths and repair route handling.",
      consequence:
        "The retry proceeds, exposing a separate client-identity problem.",
    },
    {
      title: "Repair identity",
      tag: "Explore · Diagnose",
      observation: "Backend logs report a missing client certificate.",
      action: "Trace the connection and repair client identity handling.",
      consequence:
        "Authentication is no longer the only issue: the client still receives no response body.",
    },
    {
      title: "Trace the response",
      tag: "Explore · Coordinate",
      observation:
        "The gateway logs 84 bytes, yet the downstream client receives no body.",
      action:
        "Use the discrepancy to redirect the investigation to request consumption and connection closure.",
      consequence: "The evidence changes what needs to be fixed next.",
    },
    {
      title: "Read the request",
      tag: "Build · Diagnose",
      observation: "The response path depends on how the request is read.",
      action: "Modify request reading and recover from a failed test launch.",
      consequence: "The updated implementation can be checked end to end.",
    },
    {
      title: "Recheck the chain",
      tag: "Verify · Build",
      observation:
        "A repaired component does not establish that the whole chain works.",
      action: "Rerun end-to-end checks, including invalid-client rejection.",
      consequence:
        "The local regression suite passes. This is not an exhaustive verification of every TLS requirement.",
    },
  ],
  evolutions: {
    hotel: {
      name: "Hotel scheduling",
      label: "Same ten activities. Deeper coordination.",
      parent: "Allocate venues, times, and resources for ten hotel activities.",
      generations: [
        {
          title: "Account for attendee travel",
          requirement:
            "Add attendee groups and directed travel times between venues.",
          gap: "Individually feasible activities may leave a group unable to reach its next event.",
          work: "Check each group’s complete sequence, then adjust venues or times to make the full schedule feasible.",
          artifact: "A feasible attendee itinerary",
        },
        {
          title: "Recover a published schedule",
          requirement:
            "Harbor Hall closes after the schedule has been published.",
          gap: "Planning from scratch would discard existing commitments, lodging, and billing state.",
          work: "Trace the consequences of venue changes, minimize disruption, and commit a complete recovery plan atomically.",
          artifact: "A minimum-disruption recovery plan",
        },
        {
          title: "Track physical resource readiness",
          requirement:
            "Model specific equipment, mobile units, and crew, including teardown, transfer, and installation time.",
          gap: "Having enough equipment in total does not mean a compatible unit is ready at the right location.",
          work: "Reconcile compatibility and prior commitments, calculate readiness, and revise venues, times, and resource bundles.",
          artifact: "A resource-feasible revised schedule",
        },
      ],
    },
    photoA: {
      name: "Photo library · State",
      label: "One parent task. A branch of state reconciliation.",
      parent: "Reconcile a source photo library with a destination library.",
      generations: [
        {
          title: "Preserve independent edits",
          requirement:
            "A second synchronization includes independent changes at both source and destination.",
          gap: "A one-way import cannot safely handle conflicting edits. One rating is 5 at the checkpoint, 4 at the source, and 3 at the destination.",
          work: "Compare all three states, retain rating 3 under the public policy, and explicitly flag the concurrent conflict.",
          artifact: "A three-way reconciliation",
        },
        {
          title: "Reconcile retirement and restoration",
          requirement:
            "A source retirement can conflict with later destination edits.",
          gap: "Applying retirement alone could discard a legitimate new edit.",
          work: "Compare archive state with later edits, keep conflicting photos active, apply native archive or restore operations, and rescan.",
          artifact: "Verified lifecycle state",
        },
        {
          title: "Reconcile changing file groups",
          requirement:
            "Introduce source and destination splits, plus a change of primary rendition.",
          gap: "Fixed grouping assumptions no longer match either library.",
          work: "Compare grouping states, split or switch primary files, re-identify files by digest, and update curation and sidecars.",
          artifact: "Consistent groups and primary files",
        },
      ],
    },
    photoB: {
      name: "Photo library · Identity",
      label: "The same parent. A different path through identity.",
      parent: "Reconcile a source photo library with a destination library.",
      generations: [
        {
          title: "Infer relationships from evidence",
          requirement:
            "Replace preclassified file relations with identity evidence in media metadata.",
          gap: "Names and timestamps can match for different captures, or differ for true companions.",
          work: "Extract capture and Live Photo identifiers and document lineage; resolve groups while rejecting misleading matches.",
          artifact: "Evidence-based logical photo groups",
        },
        {
          title: "Protect destination-side curation",
          requirement:
            "The destination now contains independent edits and target-only photos.",
          gap: "Recovering source identity does not make an overwrite safe.",
          work: "Match identities, then compare checkpoint, source, and destination values while preserving independent edits and collections.",
          artifact: "Identity-aware three-way merging",
        },
        {
          title: "Recover identity across transformations",
          requirement:
            "Some destination files no longer retain their original bytes.",
          gap: "A re-encoded PNG shares a source identifier, while a similar-looking target image has a different identity.",
          work: "Link transformed representations using identity evidence, keep the unrelated lookalike separate, and verify grouping through native indexing.",
          artifact: "Correct cross-system identity links",
        },
      ],
    },
  },
  benchmarks: {
    coding: [
      ["Terminal-Bench 1.0", 46.3, 55.0, 1],
      ["Terminal-Bench 2.0", 41.6, 55.8, 1],
      ["Terminal-Bench 2.1", 46.82, 60.67, 2],
    ],
    agentic: [
      ["AutomationBench · Pass rate", 5.5, 17.2, 1],
      ["AutomationBench · Partial", 26.4, 49.7, 1],
      ["τ²-bench · Airline", 79.0, 84.5, 1],
      ["τ²-bench · Retail", 84.9, 87.5, 1],
      ["VitaBench · Cross-domain", 20.5, 31.8, 1],
    ],
    reasoning: [
      ["MATH-500", 96.9, 98.9, 1],
      ["GSM8K", 96.3, 97.3, 1],
      ["AIME 2024", 93.3, 96.7, 1],
      ["AIME 2025", 86.7, 93.3, 1],
      ["KOR-Bench · Cipher", 90.1, 91.2, 1],
    ],
  },
  scaling: [
    [0, 46.82],
    [1000, 57.3],
    [2000, 58.43],
    [2852, 60.67],
  ],
  sizes: [
    ["27B", 46.82, 60.67],
    ["35B-A3B", 39.7, 52.81],
    ["122B-A10B", 49.06, 64.04],
  ],
  rsi: [
    {
      name: "Point-cloud fusion",
      title: "Keep improving beyond the first solution.",
      description:
        "Reconstruct a 3D point cloud from noisy, partial views. TerminalHorizon continues refining alignment, fusion, and filtering after the base model voluntarily stops.",
      base: 21.93,
      ours: 48.96,
      baseTime: "12.1 min",
      oursTime: "12 h",
      figure: "RSI-task",
      note: "Snapshot scores in the optimization trace are reconstructed retrospectively. They were not hidden-evaluation feedback available to the agent.",
      takeaway:
        "From an initial alignment to iterative refinement—and a final submission that preserves the improvements.",
    },
    {
      name: "Robot routing",
      title: "Make the final version the better version.",
      description:
        "Optimize robot routes and reusable macros. The base model finds a low-cost candidate but regresses in its final submission. TerminalHorizon preserves its gains through final delivery.",
      base: 14.63,
      ours: 39.72,
      baseTime: "11.42 h",
      oursTime: "12 h",
      figure: "appendix-robot",
      note: "Final public mean button costs: 466.35 for the base model and 281.11 for TerminalHorizon. Lower is better.",
      takeaway:
        "Finding a good candidate is not enough. Final delivery must retain the progress already made.",
    },
    {
      name: "Tidal inversion",
      title: "Use feedback to revise the method.",
      description:
        "Infer seabed friction from tidal observations. The base model stops after 1.12 hours, while TerminalHorizon continues autonomous research under the same 12-hour budget.",
      base: 27.41,
      ours: 48.15,
      baseTime: "1.12 h",
      oursTime: "12 h",
      figure: "appendix-tidal",
      note: "The figure combines public optimization, spatial errors, and hidden-basin results. Hidden results were not available during research.",
      takeaway:
        "Long-horizon work connects experiments, diagnosis, and substantive method changes.",
    },
    {
      name: "2048 strategy",
      title: "Turn experiments into a stronger strategy.",
      description:
        "Optimize a 2048 agent through repeated public trials, then evaluate the submitted strategy on hidden games.",
      base: 37.54,
      ours: 45.25,
      baseTime: "1.28 h",
      oursTime: "12 h",
      figure: "appendix-2048",
      note: "Hidden normalized reward is shown below. Raw game scores and maximum tiles appear in the original figure.",
      takeaway:
        "The agent continues testing and refining its strategy beyond an initial executable solution.",
    },
  ],
};
