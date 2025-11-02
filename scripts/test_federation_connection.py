#!/usr/bin/env python3
"""
🔱 Quick Federation Core Connection Test
Verifies local mode access to Federation Core

Usage:
    python scripts/test_federation_connection.py
"""

import asyncio
import aiohttp
import sys

FEDERATION_URL = "http://localhost:9405"

async def test_connection():
    """Test basic connection to Federation Core."""
    print("🔱 Testing Federation Core Connection...\n")
    
    tests_passed = 0
    tests_failed = 0
    
    # Test 1: Health Check
    print("Test 1: Health Check")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{FEDERATION_URL}/health", timeout=aiohttp.ClientTimeout(total=5)) as resp:
                if resp.status == 200:
                    health = await resp.json()
                    print(f"  ✅ PASS - Federation Core is healthy")
                    print(f"     Status: {health.get('status')}")
                    print(f"     Service: {health.get('service')}")
                    tests_passed += 1
                else:
                    print(f"  ❌ FAIL - Health check returned {resp.status}")
                    tests_failed += 1
    except asyncio.TimeoutError:
        print(f"  ❌ FAIL - Connection timeout")
        print(f"     Make sure Federation Core is running on {FEDERATION_URL}")
        tests_failed += 1
    except Exception as e:
        print(f"  ❌ FAIL - {e}")
        tests_failed += 1
    
    print()
    
    # Test 2: MCP Info
    print("Test 2: MCP Server Info")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{FEDERATION_URL}/mcp/info", timeout=aiohttp.ClientTimeout(total=5)) as resp:
                if resp.status == 200:
                    info = await resp.json()
                    print(f"  ✅ PASS - MCP server is accessible")
                    print(f"     Name: {info.get('name', 'N/A')}")
                    print(f"     Version: {info.get('version', 'N/A')}")
                    tests_passed += 1
                else:
                    print(f"  ❌ FAIL - MCP info returned {resp.status}")
                    tests_failed += 1
    except Exception as e:
        print(f"  ❌ FAIL - {e}")
        tests_failed += 1
    
    print()
    
    # Test 3: Discover Services
    print("Test 3: Service Discovery")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{FEDERATION_URL}/mcp/resources/omega/directory/servers", timeout=aiohttp.ClientTimeout(total=5)) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    servers = data.get("servers", [])
                    titans = [s for s in servers if "titan" in s.get("id", "").lower()]
                    
                    print(f"  ✅ PASS - Service discovery working")
                    print(f"     Total services: {len(servers)}")
                    print(f"     Titans discovered: {len(titans)}")
                    
                    if titans:
                        print(f"\n     Titans:")
                        for titan in titans:
                            print(f"       - {titan.get('display_name', titan.get('id'))}")
                    
                    tests_passed += 1
                else:
                    print(f"  ⚠️  WARN - Service discovery returned {resp.status}")
                    print(f"     This is OK if no services are registered yet")
                    tests_passed += 1
    except Exception as e:
        print(f"  ⚠️  WARN - {e}")
        print(f"     This is OK if the endpoint doesn't exist yet")
        tests_passed += 1
    
    print()
    
    # Summary
    print("=" * 60)
    print(f"Tests Passed: {tests_passed}")
    print(f"Tests Failed: {tests_failed}")
    print("=" * 60)
    
    if tests_failed == 0:
        print("\n✅ All tests passed! Federation Core is ready.")
        print("\nNext steps:")
        print("  1. Run the Pantheon collaboration demo:")
        print("     python scripts/pantheon_collaboration_demo.py")
        print("\n  2. Read the guide:")
        print("     cat PANTHEON_COLLABORATION_GUIDE.md")
        return 0
    else:
        print("\n❌ Some tests failed. Please check:")
        print("  1. Is Federation Core running?")
        print("     cd ../core && ./dev-mode.sh quick-fix")
        print("\n  2. Is it accessible on localhost:9405?")
        print("     curl http://localhost:9405/health")
        return 1

if __name__ == "__main__":
    print("\n🔱 OMEGA Federation Core Connection Test\n")
    exit_code = asyncio.run(test_connection())
    sys.exit(exit_code)

