import React from "react";
import type { NavItem } from '../types/navigation';

// Icon definitions for experimental features
const ChatIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const VectorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const ScorerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const MetricsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const NetworkIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>;

export interface ExperimentalFeatureNavItem extends NavItem {
  featureFlag?: string; // The experimental feature flag that must be enabled
}

// Map experimental features to their navigation items
export const experimentalFeatureNavItems: ExperimentalFeatureNavItem[] = [
  {
    key: "ef-chat",
    label: "Chat Completions",
    link: "/instance/features/chat",
    icon: ChatIcon,
    featureFlag: "chatCompletions",
    isDevelopment: true,
    description: "AI-powered chat completions for search queries"
  },
  {
    key: "ef-vector",
    label: "Vector Store",
    link: "/instance/features/vector",
    icon: VectorIcon,
    featureFlag: "vectorStore",
    isDevelopment: false,
    description: "Semantic search with vector embeddings"
  },
  {
    key: "ef-scorer",
    label: "Custom Scorers",
    link: "/instance/features/scorers",
    icon: ScorerIcon,
    featureFlag: "customScorers",
    isDevelopment: false,
    description: "Define custom scoring functions for search results"
  },
  {
    key: "ef-metrics",
    label: "Advanced Metrics",
    link: "/instance/features/metrics",
    icon: MetricsIcon,
    featureFlag: "metrics",
    isDevelopment: false,
    description: "Enhanced search analytics and performance metrics"
  },
  {
    key: "ef-network",
    label: "Network",
    link: "/instance/features/network",
    icon: NetworkIcon,
    featureFlag: "network",
    isDevelopment: false,
    description: "Network topology for horizontal database partitioning and federated search"
  }
];

// Get navigation items for enabled experimental features
export const getEnabledFeatureNavItems = (
  enabledFeatures: Record<string, boolean>
): NavItem[] => {
  return experimentalFeatureNavItems.filter(item => {
    // If no feature flag is required, always show the item
    if (!item.featureFlag) return true;

    // Check if the feature is enabled
    return enabledFeatures[item.featureFlag] === true;
  }).map(item => ({
    key: item.key,
    label: item.label,
    link: item.link,
    icon: item.icon,
    isDevelopment: item.isDevelopment,
    description: item.description,
    children: []
  }));
};

// Check if any experimental features are enabled
export const hasEnabledFeatures = (
  enabledFeatures: Record<string, boolean>
): boolean => {
  return experimentalFeatureNavItems.some(item =>
    item.featureFlag && enabledFeatures[item.featureFlag] === true
  );
};