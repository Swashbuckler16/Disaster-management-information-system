"""
Unit and Integration Tests for ADREF-DMIS Server
Used for automated testing in Jenkins CI/CD pipeline.
Runs using Python standard library unittest (no external dependencies needed).
"""

import unittest
import server
import json
import os

class TestDMISCore(unittest.TestCase):
    def test_data_structure_integrity(self):
        """Verify core database collections exist and have valid structure."""
        required_keys = ["system_info", "alerts", "incidents", "evolution_requests", "jira_board", "framework_metrics"]
        for key in required_keys:
            self.assertIn(key, server.DATA, f"Missing required data key: {key}")

    def test_system_info(self):
        """Verify SDG-13 target and system metadata are populated."""
        sys_info = server.DATA["system_info"]
        self.assertIn("SDG 13", sys_info.get("sdg_target", ""))
        self.assertEqual(sys_info.get("status"), "OPERATIONAL_EMERGENCY_READY")

    def test_alerts_content(self):
        """Verify alerts have mandatory emergency attributes."""
        alerts = server.DATA["alerts"]
        self.assertGreater(len(alerts), 0)
        for alert in alerts:
            self.assertIn("id", alert)
            self.assertIn("severity", alert)
            self.assertIn("parameters", alert)

    def test_jira_board_columns(self):
        """Verify Jira board contains standard Agile evolution stages."""
        board = server.DATA["jira_board"]
        columns = board.get("columns", {})
        expected_cols = ["backlog", "todo", "in_progress", "testing", "done"]
        for col in expected_cols:
            self.assertIn(col, columns, f"Missing Jira stage column: {col}")

    def test_public_directory_exists(self):
        """Verify frontend assets directory exists."""
        self.assertTrue(os.path.isdir(server.PUBLIC_DIR), f"Public directory not found at {server.PUBLIC_DIR}")
        self.assertTrue(os.path.isfile(os.path.join(server.PUBLIC_DIR, "index.html")), "index.html not found in public/")

if __name__ == '__main__':
    unittest.main()
